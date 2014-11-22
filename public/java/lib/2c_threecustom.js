THREE.Object3D.prototype.clear = function(){
  var that = this;
    var children = this.children;
    for(var i = children.length-1;i>=0;i--){
        var child = children[i];
        child.clear();
        that.remove(child);
    };
};

THREE.Object3D.prototype.updateScale = function(scale) {
  TweenMax.to(this.scale, 0.7, { x: scale, y:scale, z:scale});
}