pipeline {

    environment {
        DOCKER_IMAGE = 'soumyasitak/employee-backend'
        NAMESPACE = 'dev'
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
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
    command: ["cat"]
    tty: true

  - name: kaniko
    image: gcr.io/kaniko-project/executor:debug
    command: ["/busybox/cat"]
    tty: true

  - name: helm
    image: alpine/helm:3.19.0
    command: ["cat"]
    tty: true

  - name: kubectl
    image: bitnami/kubectl:1.32
    command: ["cat"]
    tty: true
'''
        }
    }

    stages {

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
                                --destination="${DOCKER_IMAGE}:${BUILD_NUMBER}" \
                                --destination="${DOCKER_IMAGE}:${GIT_COMMIT}"
                        '''
                    }
                }
            }
        }

        stage('Helm Lint') {
            steps {
                container('helm') {
                    sh 'helm lint ./helm/employee-management'
                }
            }
        }

        stage('Deploy with Helm') {
            when {
                branch 'master'
            }
            steps {
                container('helm') {
                    sh '''
                        helm upgrade --install employee-management \
                            ./helm/employee-management \
                            --namespace ${NAMESPACE} \
                            --create-namespace \
                            --set backend.image.repository=${DOCKER_IMAGE} \
                            --set backend.image.tag=${BUILD_NUMBER}
                    '''
                }
            }
        }

        stage('Ensure Database Schema') {
            when {
                branch 'master'
            }
            steps {
                container('kubectl') {
                    sh '''
                        kubectl wait --for=condition=ready pod \
                            -l app=employee-management-postgres \
                            -n ${NAMESPACE} --timeout=180s

                        POD=$(kubectl get pod -n ${NAMESPACE} \
                            -l app=employee-management-postgres \
                            -o jsonpath='{.items[0].metadata.name}')

                        kubectl exec -n ${NAMESPACE} "$POD" -- \
                            psql -U admin -d employee_db -c "
                            CREATE TABLE IF NOT EXISTS employees (
                              id SERIAL PRIMARY KEY,
                              name VARCHAR(255) NOT NULL,
                              age INTEGER NOT NULL,
                              department VARCHAR(255) NOT NULL
                            );"
                    '''
                }
            }
        }

        stage('Verify Deployment') {
            when {
                branch 'master'
            }
            steps {
                container('kubectl') {
                    sh '''
                        kubectl rollout status deployment/employee-management-employee-backend-deployment \
                            -n ${NAMESPACE} --timeout=120s
                    '''
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