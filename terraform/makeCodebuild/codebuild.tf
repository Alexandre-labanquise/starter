resource "aws_codebuild_project" "website_creator_codebuild" {
  name          = var.website_name
  description   = "This project is used to create the content of crystallize client's site"
  build_timeout = "5"
  service_role  = var.iam_role_arn

  artifacts {
    type = "NO_ARTIFACTS"
  }

  environment {
    compute_type                = "BUILD_GENERAL1_SMALL"
    image                       = "aws/codebuild/standard:7.0"
    type                        = "LINUX_CONTAINER"
    image_pull_credentials_type = "CODEBUILD"
    environment_variable {
      name  = "ENV"
      type  = "PLAINTEXT"
      value = "prod"
    }

    environment_variable {
      name  = "DEV_URL"
      type  = "PLAINTEXT"
      value = "https://${var.website_name}.labali.se"
    }

    environment_variable {
      name  = "TENANT"
      type  = "PLAINTEXT"
      value = var.website_name
    }
  }

  logs_config {
    cloudwatch_logs {
      group_name  = "log-group"
      stream_name = "log-stream"
    }
  }

  source {
    type            = "GITHUB"
    location        = "https://github.com/Labanquise/${var.website_name}"
    git_clone_depth = 1
    git_submodules_config {
      fetch_submodules = true
    }
  }

  source_version = "master"
}

data "aws_cloudwatch_event_bus" "deployment_bus" {
  name = "deployments"
}

resource "aws_cloudwatch_event_rule" "deploy_event" {
  name = "deploy-${var.website_name}"
  event_pattern = jsonencode({
    source = [
      "lambda-deploy-${var.website_name}-production"
    ]
  })
  event_bus_name = data.aws_cloudwatch_event_bus.deployment_bus.arn
}


resource "aws_cloudwatch_event_target" "event_target" {
  rule           = aws_cloudwatch_event_rule.deploy_event.name
  target_id      = "deploy-${var.website_name}"
  arn            = aws_codebuild_project.website_creator_codebuild.arn
  role_arn       = var.iam_role_arn
  event_bus_name = data.aws_cloudwatch_event_bus.deployment_bus.arn
}


resource "aws_codebuild_webhook" "deployment" {
  project_name = aws_codebuild_project.website_creator_codebuild.name

  build_type = "BUILD"
  filter_group {
    filter {
      type    = "EVENT"
      pattern = "PUSH"
    }

    filter {
      type    = "EVENT"
      pattern = "PULL_REQUEST_MERGED"
    }

    filter {
      type    = "BASE_REF"
      pattern = "master"
    }
  }
}
