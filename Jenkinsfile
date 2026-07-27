pipeline {
    
environment {
    DOCKER_IMAGE = 'soumyasitak/employee-backend'
}

    agent {
        kubernetes {
            defaultContainer 'node'

            yaml '''
apiVersion: v1
kind: Pod
metadata:
  labels:
    app: employee-management-ci
spec:

  serviceAccountName: jenkins-deployer
  containers:
  - name: node
    image: node:22
    command:
    - cat
    tty: true
    
  - name: kaniko
    image: gcr.io/kaniko-project/executor:debug
    command:
    - /busybox/cat
    tty: true
    
  - name: helm
    image: alpine/helm:3.19.0
    command:
    - cat
    tty: true
'''
        }
    }

    stages {

        stage('Checkout') {
            steps {
                git(
                    branch: 'master',
                    credentialsId: 'github-pat',
                    url: 'https://github.com/soumya-sitak/employee-management-system.git'
                )
            }
        }

        stage('Check Node Environment') {
            steps {
                sh 'node --version'
                sh 'npm --version'
            }
        }

        stage('Show Workspace') {
            steps {
                sh 'pwd'
                sh 'ls -la'
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('backend') {
                    sh 'npm ci'
                }
            }
        }
        
        stage('Test Backend') {
    steps {
        dir('backend') {
            sh 'npm test'
        }
    }
}


stage('Build and Push Docker Image') {
    steps {
        container('kaniko') {

            withCredentials([
                usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_TOKEN'
                )
            ]) {

                sh '''
                    mkdir -p /kaniko/.docker

                    AUTH=$(printf "%s:%s" "$DOCKER_USER" "$DOCKER_TOKEN" | base64 | tr -d '\\n')

                    cat > /kaniko/.docker/config.json <<EOF
{"auths":{"https://index.docker.io/v1/":{"auth":"$AUTH"}}}
EOF

                    /kaniko/executor \
                        --context="${WORKSPACE}/backend" \
                        --dockerfile="${WORKSPACE}/backend/Dockerfile" \
                        --destination="${DOCKER_IMAGE}:${BUILD_NUMBER}"
                '''
            }
        }
    }
}

stage('Check Helm') {
    steps {
        container('helm') {
            sh 'helm version'
        }
    }
}

stage('Deploy with Helm') {
    steps {
        container('helm') {
            sh '''
                helm upgrade --install employee-management \
                    ./helm/employee-management \
                    --namespace dev \
                    --set backend.image.repository=${DOCKER_IMAGE} \
                    --set backend.image.tag=${BUILD_NUMBER}
            '''
        }
    }
}

        stage('Verify Backend') {
            steps {
                dir('backend') {
                    sh 'ls -la'
                }
            }
        }

    }

    post {

        always {
            echo 'Pipeline Finished'
        }

        success {
            echo 'Build Successful'
        }

        failure {
            echo 'Build Failed'
        }
    }
}