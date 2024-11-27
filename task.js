'use strict';

const vsSource = `#version 300 es
in vec3 aColor;
out vec3 vColor;
in vec3 aPosition;
uniform mat4 uProjectionMatrix_Y;
uniform mat4 uProjectionMatrix_X;
uniform mat4 uPerspectiveMatrix;
uniform mat4 uModelViewMatrix;

void main() {
    gl_Position = uPerspectiveMatrix * (uModelViewMatrix * uProjectionMatrix_Y * uProjectionMatrix_X * vec4(aPosition, 1.0));
    vColor = aColor;
}`;

const fsSource = `#version 300 es
precision mediump float;

in vec3 vColor;
out vec4 fragColor;

void main() {
    fragColor = vec4(vColor, 1.0);
}`;

function main() {
    const canvas = document.querySelector("#glcanvas");
    const gl = canvas.getContext("webgl2");
    if (!gl) {
        console.log("Failde to get context for WebGL");
        return;
    }

    const program = gl.createProgram();
    const vsShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vsShader, vsSource);
    gl.compileShader(vsShader);
    gl.attachShader(program, vsShader);

    const fsShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fsShader, fsSource);
    gl.compileShader(fsShader);
    gl.attachShader(program, fsShader);

    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.log(gl.getShaderInfoLog(vsShader));
        console.log(gl.getShaderInfoLog(fsShader));
    }

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(program);

    const aColor = gl.getAttribLocation(program,'aColor');
    const aPosition = gl.getAttribLocation(program, 'aPosition');
    const uProjectionMatrix_Y = gl.getUniformLocation(program,'uProjectionMatrix_Y');
    const uProjectionMatrix_X = gl.getUniformLocation(program,'uProjectionMatrix_X');
    const uPerspectiveMatrix = gl.getUniformLocation(program,"uPerspectiveMatrix");
    const uModelViewMatrix = gl.getUniformLocation(program, "uModelViewMatrix");

    const crateBufferData = new Float32Array([
        -.5,-.5,-.5,   0,1,1,
        -.5, .5, .5,   0,1,1,
        -.5, .5,-.5,   0,1,1,
        -.5,-.5, .5,   0,1,1,
        -.5, .5, .5,   0,1,1,
        -.5,-.5,-.5,   0,1,1,
    
        .5 ,-.5,-.5,   1,0,1,
        .5 , .5,-.5,   1,0,1,
        .5 , .5, .5,   1,0,1,
        .5 , .5, .5,   1,0,1,
        .5 ,-.5, .5,   1,0,1,
        .5 ,-.5,-.5,   1,0,1,
    
        -.5,-.5,-.5,   0,1,0,
         .5,-.5,-.5,   0,1,0,
         .5,-.5, .5,   0,1,0,
         .5,-.5, .5,   0,1,0,
        -.5,-.5, .5,   0,1,0,
        -.5,-.5,-.5,   0,1,0,
    
        -.5, .5,-.5,   1,1,0,
         .5, .5, .5,   1,1,0,
         .5, .5,-.5,   1,1,0,
        -.5, .5, .5,   1,1,0,
         .5, .5, .5,   1,1,0,
        -.5, .5,-.5,   1,1,0,
    
         .5,-.5,-.5,   0,0,1,
        -.5,-.5,-.5,   0,0,1,
         .5, .5,-.5,   0,0,1,
        -.5, .5,-.5,   0,0,1,
         .5, .5,-.5,   0,0,1,
        -.5,-.5,-.5,   0,0,1,
    
        -.5,-.5, .5,   1,0,0,
         .5,-.5, .5,   1,0,0,
         .5, .5, .5,   1,0,0,
         .5, .5, .5,   1,0,0,
        -.5, .5, .5,   1,0,0,
        -.5,-.5, .5,   1,0,0,
    ]);

    const lidBufferData = new Float32Array([
        -.5, 0.5, -0.5,   0,1,1,
        -.5, 0.6,  0.5,   0,1,1,
        -.5, 0.6, -0.5,   0,1,1,
        -.5, 0.5,  0.5,   0,1,1,
        -.5, 0.6,  0.5,   0,1,1,
        -.5, 0.5, -0.5,   0,1,1,
    
         0.5, 0.5, -0.5,   1,0,1,
         0.5, 0.6, -0.5,   1,0,1,
         0.5, 0.6,  0.5,   1,0,1,
         0.5, 0.6,  0.5,   1,0,1,
         0.5, 0.5,  0.5,   1,0,1,
         0.5, 0.5, -0.5,   1,0,1,
    
        -.5, 0.5, -0.5,   0,1,0,
         0.5, 0.5, -0.5,   0,1,0,
         0.5, 0.5,  0.5,   0,1,0,
         0.5, 0.5,  0.5,   0,1,0,
        -.5, 0.5,  0.5,   0,1,0,
        -.5, 0.5, -0.5,   0,1,0,
    
        -.5, 0.6, -0.5,   1,1,0,
         0.5, 0.6,  0.5,   1,1,0,
         0.5, 0.6, -0.5,   1,1,0,
        -.5, 0.6,  0.5,   1,1,0,
         0.5, 0.6,  0.5,   1,1,0,
        -.5, 0.6, -0.5,   1,1,0,
    
         0.5, 0.5, -0.5,   0,0,1,
        -.5, 0.5, -0.5,   0,0,1,
         0.5, 0.6, -0.5,   0,0,1,
        -.5, 0.6, -0.5,   0,0,1,
         0.5, 0.6, -0.5,   0,0,1,
        -.5, 0.5, -0.5,   0,0,1,
    
        -.5, 0.5,  0.5,   1,0,0,
         0.5, 0.5,  0.5,   1,0,0,
         0.5, 0.6,  0.5,   1,0,0,
         0.5, 0.6,  0.5,   1,0,0,
        -.5, 0.6,  0.5,   1,0,0,
        -.5, 0.5,  0.5,   1,0,0,
    ]);


    const buffer = gl.createBuffer();

    gl.enableVertexAttribArray(aPosition);
    gl.enableVertexAttribArray(aColor);
    
    const fovY = Math.PI / 4;
    const aspectRatio = canvas.width / canvas.height

    const perspective = (fovy, aspect, near, far) => {
        var f = Math.tan(Math.PI * 0.5 - 0.5 * fovy);
        var rangeInv = 1.0 / (near - far);

        return [
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (near + far) * rangeInv, -1,
            0, 0, near * far * rangeInv * 2, 0
        ];
    };

    const translate = (translationVec) => {
        let x = translationVec[0], y = translationVec[1], z = translationVec[2];
        const matrix = [
            1,0,0,0,
            0,1,0,0,
            0,0,1,0,
            0,0,0,1,
        ]
        matrix[12] = matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12];
        matrix[13] = matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13];
        matrix[14] = matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14];
        return matrix;
    }

    let angle = 30;
    let deltaAngle = 0;
    let deltaX = 0;
    let fixedAngle = 30;
    const fixedRadian = Math.PI * fixedAngle / 180;
    const fixedCos = Math.cos(fixedRadian);
    const fixedSin = Math.sin(fixedRadian);

    const draw = () => {
        gl.clearColor(0.5, 0.2, 0.6, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        const radian = Math.PI * angle / 180;
        const cos = Math.cos(radian);
        const sin = Math.sin(radian);

        const modelViewMatrix = translate([0, -0.5, -3.5]);
        const perspectiveMatrix = perspective(fovY, aspectRatio, 0.1, 10);

        const projectionMatrix_Y = [
            cos,0,-sin,0,
            0,1,0,0,
            sin,0,cos,0,
            0,0,0,1,
        ];

        const projectionMatrix_X = new Float32Array([
            1,0,0,0,
            0,fixedCos,fixedSin,0,
            0,-fixedSin,fixedCos,0,
            0,0,0,1,
        ]);

        const radian2 = Math.PI * (fixedAngle + deltaAngle) / 180;
        const cos2 = Math.cos(radian2);
        const sin2 = Math.sin(radian2);

        const projectionMatrix_X2 = new Float32Array([
            1,0,0,0,
            0,cos2,sin2,0,
            0,-sin2,cos2,0,
            0, deltaX,deltaX,1,
        ]);
        
        gl.uniformMatrix4fv(uProjectionMatrix_Y, false, projectionMatrix_Y);
        gl.uniformMatrix4fv(uProjectionMatrix_X, false, projectionMatrix_X);
        gl.uniformMatrix4fv(uPerspectiveMatrix, false, perspectiveMatrix);
        gl.uniformMatrix4fv(uModelViewMatrix, false, modelViewMatrix);

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, crateBufferData, gl.STATIC_DRAW);

        gl.vertexAttribPointer(aPosition, 3 , gl.FLOAT, false, 6 * 4, 0);
        gl.vertexAttribPointer(aColor, 3 , gl.FLOAT, false, 6 * 4, 3 * 4);
        gl.drawArrays(gl.TRIANGLES, 0, 36);

        gl.uniformMatrix4fv(uProjectionMatrix_X, false, projectionMatrix_X2);

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, lidBufferData, gl.STATIC_DRAW);

        gl.vertexAttribPointer(aPosition, 3 , gl.FLOAT, false, 6 * 4, 0);
        gl.vertexAttribPointer(aColor, 3 , gl.FLOAT, false, 6 * 4, 3 * 4);
        gl.drawArrays(gl.TRIANGLES, 0, 36);
    };

    draw();

    window.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") {
            angle -= 10;
        }
        if (e.key === "ArrowRight") {
            angle += 10;
        }
        if (e.key === "ArrowUp") {
            if (deltaAngle != -60) {
                deltaAngle -= 30;
                deltaX += 0.3;
            }
        }
        if (e.key === "ArrowDown") {
            if (deltaAngle != 60) {
                deltaAngle += 30;
                deltaX -= 0.3;
            }
        }
        draw();
    });
}

/* TODO: потрібно зробити:
1) Окремі функції малювання для кришки і коробки(тут можна просто передавати різні координати)
2) Для кришки та коробки мають бути різні шейдерні програми, тобто коди шейдрів для кришки і коробки дублюватимуься,
але можна зробити 1 ф. для створення програми, в яку просто передавати різні шейдри і вона повератиме різні програми,
3) По черзі викликати ф. малювання кришки і коробки, передаючи їм матриці перетворення і біндити буфер на різні вершини
(коробки і кришки), можливо, по черзі викликаючи програми. 
*/