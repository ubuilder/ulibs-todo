export const get = (req, res)=>{
    console.log(`get end point at route ${req.url}`)
    res.json({message: `get end point at route ${req.url}`}, 200)
    
}

export const post = (req, res)=>{
    console.log(`post end point at route ${req.url}`)
    res.json({message: `post end point at route ${req.url}`}, 200)

}
export const put = (req, res)=>{
    console.log(`put end point at route ${req.url}`)
    res.json({message: `put end point at route ${req.url}`}, 200)

}
export const del = (req, res)=>{
    console.log(`delete end point at route ${req.url}`)
    res.json({message: `delete end point at route ${req.url}`}, 200)

}
