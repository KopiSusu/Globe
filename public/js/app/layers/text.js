// describes introduction text
define(['./util', 'three'],
function(convert, THREE) {
    
    var layer = new THREE.Object3D();

    var geometry  = new THREE.TextGeometry( "CLICK ANYWHERE TO START", {
        size: 18,
        height: 4,
        curveSegments: 0,
        font: 'helvetiker',
        material: 0,
        extrudeMaterial: 1,
        opacity: 0.5
    });

    var logogeo  = new THREE.TextGeometry( "KOPI WARS", {
        size: 18,
        height: 4,
        curveSegments: 0,
        font: 'helvetiker',
        material: 0,
        extrudeMaterial: 1,
        opacity: 0.5
    });

    var materialFront = new THREE.MeshBasicMaterial({
        color: 0x2194CE
    });
    var materialSide = new THREE.MeshBasicMaterial({
        color: 0x555555
    });
    var materialArray = [materialFront, materialSide];

    geometry.computeBoundingBox();

    var center  = new THREE.Vector3();
    center.x  = (geometry.boundingBox.max.x - geometry.boundingBox.min.x) / 2
    center.z  = (geometry.boundingBox.max.z - geometry.boundingBox.min.z) / 2
    geometry.vertices.forEach(function(vertex){
      vertex.sub(center)
    })
    var textMaterial = new THREE.MeshFaceMaterial(materialArray);
    var click = new THREE.Mesh( geometry, textMaterial );
    var logo = new THREE.Mesh( logogeo, textMaterial );

    click.position.x = 7;
    click.position.y = 150;
    logo.position.x = -65;
    logo.position.y = -170;
    layer.add(click);
    layer.add(logo);

  return {
    init: function()
    {
      return layer;
    }
  };
});

