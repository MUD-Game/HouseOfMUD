pipeline {
    agent any
        stages {
            stage('Startup') {
                steps {
                    script {
                        echo 'Hello'
                        sh 'npm ci'
                    }
                }
            }
            stage('Test') {
                steps {
                    script {
                        sh 'npm run test'
                    }
                }
                post {
                    always {
                        junit 'junit.xml'
                    }
                }
            }
        }
}