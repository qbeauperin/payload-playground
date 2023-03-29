import { CollectionBeforeChangeHook } from 'payload/types';
import { CollectionBeforeReadHook } from 'payload/types';
import { CollectionAfterChangeHook } from 'payload/types';
import Posts from '../Posts';

// const checkForStatus(object){
//     let hasDrafts = false;

//     if(object._status){
//         if(object._status === "draft"){
//             hasDrafts = true;
//         }
//     }else{
//         for (const [key, value] of Object.entries(object)) {
//             if(typeof(value) )
//             console.log(`${key}: ${value}`);
//         }
//     }

//     return hasDrafts;
// }

const beforeChangeHook: CollectionBeforeChangeHook = async ({ data, operation, originalDoc }) => {
    console.log(`Operation: ${operation}`);
    if(data?._status === "published"){
        console.log("Check for unpublished relations");
        console.log(data);
    }
    return data;
}

const beforeReadHook: CollectionBeforeReadHook = async ({ doc }) => {
    console.log("Before read hook!");
    // console.log(doc);
    return doc;
}

const afterChangeHook: CollectionAfterChangeHook = async ({ doc }) => {
    console.log("After changed hook!");
    // console.log(doc);
    return doc;
}

export { beforeChangeHook, beforeReadHook, afterChangeHook };