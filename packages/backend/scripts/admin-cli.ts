import { spawnSync } from "node:child_process";
import * as readline from "node:readline";
import { Writable } from "node:stream";

function ask(question: string, hidden = false): Promise<string> {
  return new Promise((resolve) => {
    let muted = false;
    const out = new Writable({
      write(chunk, encoding, cb) {
        if (!muted) process.stdout.write(chunk, encoding);
        cb();
      },
    });
    const rl = readline.createInterface({
      input: process.stdin,
      output: out,
      terminal: true,
    });
    rl.question(question, (answer) => {
      rl.close();
      if (hidden) process.stdout.write("\n");
      resolve(answer.trim());
    });
    muted = hidden;
  });
}

const mode = process.argv[2];
if (mode !== "reset" && mode !== "create") {
  console.error("Usage: bun scripts/admin-cli.ts <reset|create>");
  process.exit(1);
}

const email = (await ask("Admin email: ")).toLowerCase();
const name = mode === "create" ? await ask("Name: ") : "";
const password = await ask("Password (min 8 chars): ", true);
const confirm = await ask("Confirm password: ", true);

if (!email.includes("@")) {
  console.error("Invalid email.");
  process.exit(1);
}
if (password.length < 8) {
  console.error("Password must be at least 8 characters.");
  process.exit(1);
}
if (password !== confirm) {
  console.error("Passwords do not match.");
  process.exit(1);
}

const proceed = await ask(
  `Run "${mode}" for ${email} on PRODUCTION? (yes/no): `,
);
if (proceed.toLowerCase() !== "yes") {
  console.log("Cancelled.");
  process.exit(0);
}

const fn =
  mode === "reset" ? "seed:resetPasswordByEmail" : "seed:createAdminAccount";
const args =
  mode === "reset"
    ? { email, newPassword: password }
    : { email, password, name: name || "Admin" };

const result = spawnSync(
  "npx",
  ["convex", "run", "--prod", fn, JSON.stringify(args)],
  { stdio: "inherit" },
);
process.exit(result.status ?? 1);
