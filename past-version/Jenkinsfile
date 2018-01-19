@Library('github.com/fabric8io/fabric8-pipeline-library@master')
def utils = new io.fabric8.Utils()
def flow = new io.fabric8.Fabric8Commands()
def project = 'openfact-ui/openfact-ui'
def ciDeploy = false
def imageName
node{
    properties([
        disableConcurrentBuilds()
        ])
}

fabric8UITemplate{
    dockerNode{
        timeout(time: 1, unit: 'HOURS') {
            ws {
                checkout scm
                readTrusted 'release.groovy'
                def pipeline = load 'release.groovy'

                if (utils.isCI()){

                    container('ui'){
                        pipeline.ci()
                    }

                    imageName = "openfact/openfact-ui:SNAPSHOT-${env.BRANCH_NAME}-${env.BUILD_NUMBER}"
                    container('docker'){
                        pipeline.buildImage(imageName)
                    }

                    ciDeploy = true

                } else if (utils.isCD()){
                    sh "git checkout master"
                    sh "git pull"
                    sh "git remote set-url origin git@github.com:${project}.git"
                    container('ui'){
                        pipeline.ci()
                    }
                    def v = getNewVersion {}
                    imageName = "openfact/openfact-ui:${v}"
                    container('docker'){
                        pipeline.buildImage(imageName)
                    }
                    pipeline.updateDownstreamProjects(v)
                }
            }
        }
    }
}

// deploy a snapshot openfact-ui pod and notify pull request of details
if (ciDeploy){
   def prj = 'openfact-ui-'+ env.BRANCH_NAME
   prj = prj.toLowerCase()
   def route
   deployOpenShiftNode(openshiftConfigSecretName: 'openfact-intcluster-config'){
       stage("deploy ${prj}"){
           route = deployOpenShiftSnapshot{
               mavenRepo = 'http://central.maven.org/maven2/io/openfact/online/apps/openfact-ui'
               githubRepo = 'openfact-ui'
               originalImageName = 'registry.devshift.net/openfact-ui/openfact-ui'
               newImageName = imageName
               openShiftProject = prj
               githubProject = project
           }
       }
       stage('notify'){
           def changeAuthor = env.CHANGE_AUTHOR
           if (!changeAuthor){
               echo "no commit author found so cannot comment on PR"
           }
           def pr = env.CHANGE_ID
           if (!pr){
               echo "no pull request number found so cannot comment on PR"
           }
           def message = "@${changeAuthor} ${imageName} openfact-ui is deployed and available for testing at https://${route}"

           if (!pr){
                echo message
           } else {
                container('clients'){
                    flow.addCommentToPullRequest(message, pr, project)
                }
           }
       }
   }
}
