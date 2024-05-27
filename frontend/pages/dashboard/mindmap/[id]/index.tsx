import { useEffect, useState } from 'react'
import { Stack, Button, useToast } from '@chakra-ui/react'
import useUser from '@/providers/userStore'
import {
    Excalidraw,
    exportToClipboard,
    exportToBlob
} from "@excalidraw/excalidraw";
import { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types';
import initialdata from '../initialdata';

import { FaSave } from "react-icons/fa";
import { FaImage } from "react-icons/fa";
import { useParams } from 'next/navigation';
import api from '@/utils/fetcher';


export default function MindMapPage() {

    //@ts-ignore
    const setUser = useUser((state) => state.setUser)

    const [initialData, setInitialData] = useState(null)

    const { id } = useParams()

    const toast = useToast()

    const [
        excalidrawAPI,
        setExcalidrawAPI
    ] = useState<ExcalidrawImperativeAPI | null>(null);


    useEffect(() => {
        if(typeof window != 'undefined'){
            if (id) {
                LoadMap()
            }   
        }
    }, [id])

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.ctrlKey && event.key === 's') {
                event.preventDefault();
                saveMindMap()
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        // Cleanup the event listener when the component unmounts
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const LoadMap = async () => {
        const { data } = await api.get(`/api/user/mindmap/${id}`)
        console.log(data)
        const { status } = data
        if (status) {
            if (typeof data.mindmap.data === 'string') {
                const _temp = JSON.parse(data.mindmap.data)
                // Just a bug of coverting string to json
                _temp.appState.collaborators = []
                setInitialData(_temp)
            } else {
                setInitialData(data.mindmap.data)
            }
        }
    }


    const save = async (type: "png" | "svg" | "json") => {
        if (!excalidrawAPI) {
            return false;
        }
        await exportToClipboard({
            elements: excalidrawAPI.getSceneElements(),
            appState: excalidrawAPI.getAppState(),
            files: excalidrawAPI.getFiles(),
            type
        });
        console.log(`Copied to clipboard as ${type} successfully`);
    };
    const exportImage = async () => {
        if (!excalidrawAPI) {
            return;
        }
        const blob = await exportToBlob({
            elements: excalidrawAPI?.getSceneElements(),
            mimeType: "image/png",
            appState: {
                ...initialdata.appState,
            },
            files: excalidrawAPI?.getFiles()
        });
        const a = document.createElement('a')
        a.href = window.URL.createObjectURL(blob)
        a.download = 'out.png'
        a.click()
    }

    const saveMindMap = async () => {
        if (!excalidrawAPI) {
            return;
        }
        const json = {
            elements: excalidrawAPI.getSceneElements(),
            appState: excalidrawAPI.getAppState(),
            files: excalidrawAPI.getFiles(),
            type: 'json'
        }

        const blob = await exportToBlob({
            elements: excalidrawAPI?.getSceneElements(),
            mimeType: "image/png",
            appState: {
                ...initialdata.appState,
            },
            files: excalidrawAPI?.getFiles()
        });

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result;
            console.log(base64String);
            console.log(json)

            api.put(`/api/user/mindmap/${id}`, {
                thumbnail: base64String,
                data: JSON.stringify(json)
            }).then(res => {
                console.log(res)
                toast({
                    title: 'MindMap Saved',
                    position: 'top-right',
                    duration: 1500
                })
            }).catch(err => {
                console.log(err)
            })


        };
        reader.readAsDataURL(blob);


    }




    return <Stack>
        <div style={{ height: "100vh" }}>
            <Stack display={'flex'} width={'80%'} flexDirection={'row'} pos={'absolute'} left={20} top={5} zIndex={3} >
                <Button onClick={saveMindMap} ><FaSave /></Button>
                <Button onClick={exportImage} ><FaImage /></Button>
            </Stack>
            {initialData && <Excalidraw
                initialData={initialData}
                excalidrawAPI={(api: ExcalidrawImperativeAPI) => setExcalidrawAPI(api)}
            />}
        </div>
    </Stack>
}