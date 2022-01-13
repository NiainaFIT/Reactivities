import React, { useEffect, useState } from "react";
import { Button, Grid, Header } from "semantic-ui-react";
import ImageWidgetDropzone from "./ImageWidgetDropzone";
import { Cropper } from "react-cropper";
import ImageWidgetCropper from "./ImageWidgetCropper";

interface Props{
    loading: boolean;
    uploadPhoto: (file: Blob) => void;
}

export default function ImageUploadWidget({loading, uploadPhoto}: Props){
    const [files, setFiles] = useState<any>([]);
    const [cropper, setCropper] = useState<Cropper>();

    function onCrop(){
        if(cropper){
            cropper.getCroppedCanvas().toBlob(blob => uploadPhoto(blob!));
        }
    }

    useEffect(() => {
        return () => {
            files.forEach((file: any) => URL.revokeObjectURL(file.preview));
        }
    }, [files])

    return(
        <>
        <Grid>
            <Grid.Column  mobile={16} tablet={8} computer={4}>
                <Header sub color='teal' content='Step 1- Add photo'/>
                <ImageWidgetDropzone setFiles={setFiles}/>
            </Grid.Column>
            <Grid.Column width={1}/>

            <Grid.Column  mobile={16} tablet={8} computer={4}>
                <Header sub color='teal' content='Step 2- Resize image'/>
                {files && files.length > 0 && (
                   <ImageWidgetCropper setCropper = {setCropper} imagePreview={files[0].preview}/>
                )}
            </Grid.Column>
            <Grid.Column width={1}/>

            <Grid.Column  mobile={16} tablet={8} computer={4}>
                <Header sub color='teal' content='Step 3- Preview & Upload'/>
                {files && files.length > 0 && 
                <>
                    <div className='img-preview' style={{minHeight:200, overflow: 'hidden'}}/>
                    
                </>}
                
            </Grid.Column>
        </Grid>
         <Grid>
         <Grid.Row textAlign='right'>
            <Grid.Column mobile={16} tablet={8} computer={4} floated='right'>
            {files && files.length > 0 && 
                <>
                    <Button.Group widths={2}>
                        <Button loading={loading} onClick={onCrop} positive icon='check'/>
                        <Button disabled={loading} onClick={() => setFiles([])} icon='close'/>
                    </Button.Group>
                </>}
            </Grid.Column>
             
         </Grid.Row>
     </Grid>
     </>
    )
}