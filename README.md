# Migration to ECR

In `docker-compose.yml` I configured the image names to include the ECR prefix:

```yml
  backend:
    image: "088582823373.dkr.ecr.us-east-1.amazonaws.com/ttt-backend:latest"

  frontend:
    image: "088582823373.dkr.ecr.us-east-1.amazonaws.com/ttt-frontend:latest"
```

Then I authenticated to the ECR using the following command:

```shell
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 088582823373.dkr.ecr.us-east-1.amazonaws.com
```

Finally, build and push the images as usual:

```shell
docker compose build
docker compose push
```

# Migrating to beanstalk

Excerpt from the documentation:

```
AWS Elastic Beanstalk
• This service can assume the LabRole IAM role.
• To create an application: choose Create Application, give it an application name, choose a
platform, then choose Configure more options. Scroll down to the Security panel and choose
Edit. For Service role, choose LabRole. If the environment is in the us-east-1 AWS Region, for
EC2 key pair, choose vockey and for IAM instance profile, choose LabInstanceProfile. Choose
Save, then choose Create app.
• Supported instance types: nano, micro, small, medium, and large. If you attempt to launch a
larger instance type, it will be terminated.
```

I followed the instructions and created the application with default environment.