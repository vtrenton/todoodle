# Todoodle
A simple and intuitive to-do list application.

## Prerequisites
Docker or Podman installed on your machine.

## Running Todoodle with Docker or Podman
### Building the Docker Image
Navigate to the root directory of the project where the Dockerfile is located.
For Docker:
```bash
docker build -t todoodle .
```
For Podman:
```bash
podman build -t todoodle .
```
### Running the Container
For Docker:
```bash
docker run -p 3000:3000 todoodle
```
For Podman:
```bash
podman run -p 3000:3000 todoodle
```
This command maps port 3000 of the container to port 3000 on your host machine. Adjust the ports if your
application uses a different port.

## Accessing the Application
Open your web browser and navigate to:

http://localhost:3000

You should now see the Todoodle application running.

## Additional Docker Commands
### Listing Running Containers
For Docker:
```bash
docker ps
```
For Podman:
```bash
podman ps
```
### Stopping the Container
First, find the Container ID using the `ps` command above, then stop it using:

For Docker:
```bash
docker stop <CONTAINER_ID>
```
For Podman:
```bash
podman stop <CONTAINER_ID>
```
### Removing Unused Images
For Docker:
```bash
docker image prune
```
For Podman:
```bash
podman image prune
```
```
