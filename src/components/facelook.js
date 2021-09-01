import { useEffect } from 'react'
import '../App.css'
import * as faceapi from 'face-api.js';
import { tinyFaceDetector } from 'face-api.js';

// patch nodejs environment, we need to provide an implementation of
// HTMLCanvasElement and HTMLImageElement




const Facelook = () => {

    const loadModels = async () => {
        const MODEL_URL = process.env.PUBLIC_URL + '/models' 
        await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL)
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
        
    }
    

    const randomPic = () => {
        const image = new Image();

        image.crossOrigin = true;
        console.log('object2')
        image.src = 'https://source.unsplash.com/512x512/?face';
        image.width = 512
        image.height = 512

        return image;
    }

    const loadImage = async () => {

        await loadModels();
        const image = await randomPic();
        let faces = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors();
        console.log(faces)
        const displaySize = { width: image.width, height: image.height }
        faces = faceapi.resizeResults(faces,displaySize)

          const canvas = document.createElement('canvas'); 
          const context = canvas.getContext('2d');

            canvas.height = 512;
            canvas.width = 512;
            context.drawImage(
            image,
            0,
            0,
            canvas.width,
            canvas.height
            );

            document.getElementById('overlay').appendChild(canvas);
            faceapi.draw.drawDetections(canvas, faces)
    }

    useEffect(() => {
        loadImage();
    },[]);

    return (
        <div id="overlay">
        </div>
    )
}

export default Facelook
