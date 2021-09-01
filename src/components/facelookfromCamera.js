import { useEffect, useState } from 'react'
import '../App.css'
import * as faceapi from 'face-api.js';
import Webcam from "react-webcam";
import { tinyFaceDetector } from 'face-api.js';




const FacelookFromCamera = () => {

    const [video,setVideo] = useState(null);


    const loadModels = async () => {
        const MODEL_URL = process.env.PUBLIC_URL + '/models' 
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
        this.mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }})
        setVideo(this.mediaStream);
    }
    


    const loadImage = async () => {

        
        if (
            video.current.paused ||
            video.current.ended
          ) {
            setTimeout(() => loadImage());
            return;
          }
        

        
        let faces = await faceapi.detectAllFaces(video.current, new tinyFaceDetector()).withFaceLandmarks().withFaceDescriptors();
        //console.log(faces)
        const displaySize = { width: 512, height: 512 }
        faces = faceapi.resizeResults(faces,displaySize)

          const canvas = document.createElement('canvas'); 
          const context = canvas.getContext('2d');

            canvas.height = 512;
            canvas.width = 512;
            context.drawImage(
            video.current,
            0,
            0,
            canvas.width,
            canvas.height
            );

            document.getElementById('overlay').appendChild(canvas);
            faceapi.draw.drawDetections(canvas, faces)
            setTimeout(() => loadImage(), 1000)
    }

    useEffect(() => {
        loadModels()
    },[]);

    return (
        <div>
         <video
            ref={video}
            autoPlay
            muted
            onPlay={loadImage}
            style={{
              position: "absolute",
              width: "100%",
              height: "100vh",
              left: 0,
              right: 0,
              bottom: 0,
              top: 0
            }}
          />
      </div>
    )
}

export default FacelookFromCamera
