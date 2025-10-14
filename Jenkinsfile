pipeline {
    agent any

    environment {
        AWS_REGION = 'us-east-1'
        ECR_USERS = 'users'
        ECR_PRODUCTS = 'products'
        CLUSTER_NAME = 'demo-cluster'
        NAMESPACE = 'demo'
        AWS_ACCOUNT_ID = ''
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/<your-username>/ci-cd-microservices-jenkins.git'
            }
        }

        stage('Setup AWS') {
            steps {
                script {
                    sh '''
                    AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
                    echo "AWS_ACCOUNT_ID=$AWS_ACCOUNT_ID" >> env.properties
                    '''
                    env.AWS_ACCOUNT_ID = sh(script: "aws sts get-caller-identity --query Account --output text", returnStdout: true).trim()
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                sh """
                docker build -t ${ECR_USERS}:latest services/users
                docker build -t ${ECR_PRODUCTS}:latest services/products
                """
            }
        }

        stage('Login to ECR') {
            steps {
                sh """
                aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                """
            }
        }

        stage('Tag & Push Images to ECR') {
            steps {
                sh """
                docker tag ${ECR_USERS}:latest ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_USERS}:latest
                docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_USERS}:latest

                docker tag ${ECR_PRODUCTS}:latest ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_PRODUCTS}:latest
                docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_PRODUCTS}:latest
                """
            }
        }

        stage('Deploy to EKS') {
            steps {
                sh """
                aws eks update-kubeconfig --name ${CLUSTER_NAME} --region ${AWS_REGION}

                sed -i "s#<AWS_ACCOUNT_ID>#${AWS_ACCOUNT_ID}#g" k8s/*.yaml
                sed -i "s#<AWS_REGION>#${AWS_REGION}#g" k8s/*.yaml

                kubectl apply -f k8s/namespace.yaml
                kubectl apply -f k8s/users-deployment.yaml
                kubectl apply -f k8s/products-deployment.yaml
                """
            }
        }
    }

    post {
        success {
            echo "✅ Deployment successful!"
        }
        failure {
            echo "❌ Pipeline failed!"
        }
    }
}
