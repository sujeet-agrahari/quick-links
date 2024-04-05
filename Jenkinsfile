
def APP_VERSION = ''
pipeline {
    agent any
    tools {nodejs "Nodejs"}
    
    environment {
        DOCKER_IMAGE_NAME = "quick-links"
        DOCKERFILE_PATH = "Dockerfile"
        GITHUB_USERNAME = "sujeet-agrahari"
        GITHUB_TOKEN = credentials('github_jenkins_token')
        PACKAGE_NAME = "quick-links"
        PACKAGE_VERSION = "1.0.0"
    }
    
    stages {
        stage('Preparation') {
            steps {
                    git branch: 'main',
                        credentialsId: 'github_jenkins_token',
                        url: "https://github.com/${GITHUB_USERNAME}/${PACKAGE_NAME}.git"
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm install'  // Assuming you're using npm for testing
                sh 'npm test'     // Run tests
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    // Read version from package.json
                    APP_VERSION = sh(script: 'node -pe "require(\'./package.json\').version"', returnStdout: true).trim()
                    
                    // Build Docker image
                    sh "docker build -t ${DOCKER_IMAGE_NAME}:${APP_VERSION} -f ${DOCKERFILE_PATH} ."
                }
            }
        }
        
        stage('Push Docker Image to Registry(ECR)') {
            steps {
                script {
                    // Authenticate with GitHub Packages
                    sh "echo ${GITHUB_TOKEN_PSW} | docker login ghcr.io -u ${GITHUB_USERNAME} --password-stdin"
                    
                    // Tag Docker image for GitHub Packages
                    sh "docker tag ${DOCKER_IMAGE_NAME}:${APP_VERSION} ghcr.io/${GITHUB_USERNAME}/${DOCKER_IMAGE_NAME}:${APP_VERSION}"
                    
                    // Push Docker image to GitHub Packages
                    sh "docker push ghcr.io/${GITHUB_USERNAME}/${DOCKER_IMAGE_NAME}:${APP_VERSION}"
                }
            }
        }
    }
    
    post {
        always {
            sh 'docker logout'
        }
    }
}
