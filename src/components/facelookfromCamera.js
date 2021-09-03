import { useEffect, useState } from 'react'
import '../App.css'
import * as faceapi from 'face-api.js';
import Webcam from "react-webcam";
import { tinyFaceDetector } from 'face-api.js';




const FacelookFromCamera = () => {

    const [video,setVideo] = useState(null);
    const [mediast,mediastrimset] = useState(null);


    const loadModels = async () => {
        const MODEL_URL = process.env.PUBLIC_URL + '/models' 
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)

        
        const vd = document.getElementById("video")
        let strtVideo = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }})
        .then(stream => { 
          vd.srcObject = stream;
            vd.play()
            
            const cnv = document.getElementById("canvas")
            cnv.height = vd.height;
            cnv.width = vd.width;
            const displaySize = {width:vd.width,height:vd.height}
            console.log(displaySize)
            vd.addEventListener('play',() => {
              setInterval(async () => {
                
                let faces = await faceapi.detectAllFaces(vd, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
                const resizedDetections = faceapi.resizeResults(faces, displaySize);
                cnv.getContext("2d").clearRect(0,0,cnv.width,cnv.height)
                faceapi.draw.drawDetections(cnv,resizedDetections)
              },1000)
          })
        },error => console.error(error))
    }
    

    useEffect(() => {
        loadModels()
    },[]);

    return (
        <div id="vdandCanv">
         <video
            id="video"
            autoPlay
            muted
            width="500"
            height="300"
            style={{

              position: "relative",
              left: 0,
              right: 0,
              bottom: 0,
              top: 0
            }}
          />
          <canvas id="canvas"></canvas>
      </div>
    )
}

export default FacelookFromCamera
