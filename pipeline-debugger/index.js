#!/usr/bin/env node
import fs from 'fs';
import { spawn } from 'child_process';
import yaml from 'js-yaml';

if (process.argv.length < 4) {
  console.error('Usage: pipeline-debugger <workflow-yaml> <job-id>');
  process.exit(1);
}

const [workflowFile, jobId] = process.argv.slice(2);
const workflow = yaml.load(fs.readFileSync(workflowFile, 'utf8'));
const job = workflow.jobs?.[jobId];

if (!job) {
  console.error(`Job ${jobId} not found in workflow`);
  process.exit(1);
}

const image = job.container?.image || 'ubuntu:latest';
const steps = job.steps || [];

console.log(`Pulling image ${image}...`);
await run('docker', ['pull', image]);

console.log(`Starting interactive session for job ${jobId}\n`);
for (const step of steps) {
  if (step.run) {
    console.log(`\n>> ${step.name || step.run}`);
    await run('docker', ['run', '--rm', image, 'bash', '-c', step.run]);
  }
}

async function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit' });
    p.on('exit', code => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} exited with code ${code}`));
    });
  });
}
