'use strict';

const vsSource = `#version 300 es
in vec3 aColor;
out vec3 vColor;
in vec3 aPosition;
uniform mat4 uTransormMatrix;
uniform mat4 uPerspectiveMatrix;
uniform mat4 uModelViewMatrix;

void main() {
    gl_Position = uPerspectiveMatrix * (uModelViewMatrix * uTransormMatrix * vec4(aPosition, 1.0));
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
    const uTransormMatrix = gl.getUniformLocation(program,'uTransormMatrix');
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

    const buffer = gl.createBuffer();

    gl.enableVertexAttribArray(aPosition);
    gl.enableVertexAttribArray(aColor);
    
    const fovY = Math.PI / 4;
    const aspectRatio = canvas.width / canvas.height

    const perspective = (fovy, aspect, near, far) => {
        const f = Math.tan(Math.PI * 0.5 - 0.5 * fovy);
        const rangeInv = 1.0 / (near - far);

        return [
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (near + far) * rangeInv, -1,
            0, 0, near * far * rangeInv * 2, 0
        ];
    };

    const translate = (matrix, translationVec) => {
        const x = translationVec[0], y = translationVec[1], z = translationVec[2];
        matrix[12] = matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12];
        matrix[13] = matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13];
        matrix[14] = matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14];
    };

    const moveOn = (matrix, moveOnVec) => {
        const x = moveOnVec[0], y = moveOnVec[1],z = moveOnVec[2];
        matrix[12] = x;
        matrix[13] = y;
        matrix[14] = z;
    };

    const multiply = (a, b) => {
        const a00 = a[0 * 4 + 0], a01 = a[0 * 4 + 1], a02 = a[0 * 4 + 2], a03 = a[0 * 4 + 3];
        const a10 = a[1 * 4 + 0], a11 = a[1 * 4 + 1], a12 = a[1 * 4 + 2], a13 = a[1 * 4 + 3];
        const a20 = a[2 * 4 + 0], a21 = a[2 * 4 + 1], a22 = a[2 * 4 + 2], a23 = a[2 * 4 + 3];
        const a30 = a[3 * 4 + 0], a31 = a[3 * 4 + 1], a32 = a[3 * 4 + 2], a33 = a[3 * 4 + 3];
        const b00 = b[0 * 4 + 0], b01 = b[0 * 4 + 1], b02 = b[0 * 4 + 2], b03 = b[0 * 4 + 3];
        const b10 = b[1 * 4 + 0], b11 = b[1 * 4 + 1], b12 = b[1 * 4 + 2], b13 = b[1 * 4 + 3];
        const b20 = b[2 * 4 + 0], b21 = b[2 * 4 + 1], b22 = b[2 * 4 + 2], b23 = b[2 * 4 + 3];
        const b30 = b[3 * 4 + 0], b31 = b[3 * 4 + 1], b32 = b[3 * 4 + 2], b33 = b[3 * 4 + 3];
      
        return [
          b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
          b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
          b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
          b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
          b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
          b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
          b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
          b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
          b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
          b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
          b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
          b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
          b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
          b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
          b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
          b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
        ];
    };

    const scale = (a, v) => {
        const x = v[0],
          y = v[1],
          z = v[2];
      
        a[0] *= x;
        a[1] *= x;
        a[2] *= x;
        a[3] *= x;
        a[4] *= y;
        a[5] *= y;
        a[6] *= y;
        a[7] *= y;
        a[8] *= z;
        a[9] *= z;
        a[10] *= z;
        a[11] *= z;
    };

    let angle = 30;
    let deltaAngle = 0;
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

        const modelViewMatrix = new Float32Array([
            1,0,0,0,
            0,1,0,0,
            0,0,1,0,
            0,0,0,1,
        ]);

        translate(modelViewMatrix, [0, -0.5, -3.5]);
        const perspectiveMatrix = perspective(fovY, aspectRatio, 0.1, 10);

        const projectionMatrix_Y = new Float32Array([
            cos,0,-sin,0,
            0,1,0,0,
            sin,0,cos,0,
            0,0,0,1,
        ]);

        const projectionMatrix_X = new Float32Array([
            1,0,0,0,
            0,fixedCos,fixedSin,0,
            0,-fixedSin,fixedCos,0,
            0,0,0,1,
        ]);

        const transformMatrix1 = multiply(projectionMatrix_Y, projectionMatrix_X);

        const radian2 = Math.PI * (fixedAngle + deltaAngle) / 180;
        const cos2 = Math.cos(radian2);
        const sin2 = Math.sin(radian2);

        const projectionMatrix_X2 = new Float32Array([
            1,0,0,0,
            0,cos2,sin2,0,
            0,-sin2,cos2,0,
            0,0,0,1,
        ]);

        moveOn(projectionMatrix_X2, [0, 0.65, -0.2]);
        translate(projectionMatrix_X2, [0, 0.05, 0.5]);
        
        gl.uniformMatrix4fv(uTransormMatrix, false, transformMatrix1);
        gl.uniformMatrix4fv(uPerspectiveMatrix, false, perspectiveMatrix);
        gl.uniformMatrix4fv(uModelViewMatrix, false, modelViewMatrix);

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, crateBufferData, gl.STATIC_DRAW);

        gl.vertexAttribPointer(aPosition, 3 , gl.FLOAT, false, 6 * 4, 0);
        gl.vertexAttribPointer(aColor, 3 , gl.FLOAT, false, 6 * 4, 3 * 4);
        gl.drawArrays(gl.TRIANGLES, 0, 36); 

        const transformMatrix2 = multiply(projectionMatrix_Y, projectionMatrix_X2);
        scale(transformMatrix2, [1, 0.1, 1]);

        gl.uniformMatrix4fv(uTransormMatrix, false, transformMatrix2);
        gl.drawArrays(gl.TRIANGLES, 0, 36);
    };

    draw();

    window.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") {
            angle -= 10;
            draw();
        }
        if (e.key === "ArrowRight") {
            angle += 10;
            draw();
        }
        if (e.key === "ArrowUp") {
            if (deltaAngle > -60) {
                deltaAngle -= 10;
            }
            draw();
        }
        if (e.key === "ArrowDown") {
            if (deltaAngle < 0) {
                deltaAngle += 10;
            }
            draw();
        }
    });
}
