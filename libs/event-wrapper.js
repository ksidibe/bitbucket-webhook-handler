const EVENT_TYPES = {
    repository_push: 'repo:push',
    repository_fork: 'repo:fork',
    repository_updated: 'repo:updated',
    repository_commit_status_created: 'repo:commit_status_created',
    repository_commit_status_updated: 'repo:commit_status_updated'
};
function EventWrapper(req){
    this.req = req;
    this.bitbucketEvent = req.body;
    this.type = req.get('X-Event-Key');

}
EventWrapper.prototype.getType = function(){
    return this.type;
}
EventWrapper.prototype.getEvent = function(){
    return this.bitbucketEvent;
}
EventWrapper.prototype.getCommitStatus = function(){
    return this.bitbucketEvent && this.bitbucketEvent.commit_status;
}

EventWrapper.prototype.isBuildEvent = function(){
    return this.bitbucketEvent
            && this.getCommitStatus()
            && this.getCommitStatus().type == 'build';
}
EventWrapper.prototype.isBuildSuccessful = function(){
    return this.isBuildEvent() && this.getCommitStatus().state.toUpperCase() == 'SUCCESSFUL';
}
EventWrapper.prototype.getBuildBranch = function(){
    return this.isBuildEvent() && this.getCommitStatus().refname;
}
exports.EventWrapper = EventWrapper;