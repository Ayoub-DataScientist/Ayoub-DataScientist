# Interactive Pipeline Debugger (Prototype)

This prototype CLI fetches a GitHub Actions workflow, reproduces a job's
container environment, and allows step-by-step execution. It is a minimal
starting point for the **Interactive Pipeline Debugger** concept.

## Usage

```bash
node index.js <workflow-file> <job-id>
```

The tool will:
1. Parse the workflow YAML and select the requested job.
2. Pull the Docker image specified in the job.
3. Execute each step interactively so you can inspect and rerun commands.

The implementation is intentionally simple and should be expanded with
additional features like CI provider integration, secrets management, and
team collaboration.
