exports.execute = async(req,res)=>{
    try{
        const {code,compiler,questionId,unique,program} = req.body;
        const userID = req.user;
        let parmeter = "";
        let extra_params = {
            userID:userID,
            questionId:questionId,
            unique:unique,
            program:program
        }
      
        let headersList = {
            Accept: "*/*",
            Authorization: process.env.ONLINE_COMPILER_KEY,
            "Content-Type": "application/json",
          };
          let bodyContent = JSON.stringify({
            code: code,
            input: parmeter,
            compiler: compiler,
            extra_params: extra_params,
          });
          let response = await fetch("https://onlinecompiler.io/api/v2/run-code/", {
            method: "POST",
            body: bodyContent,
            headers: headersList,
          });
        let data = await response.text();
        console.log(data)
        if (data !== "Ok"){
            return res.status(500).json({message:' Something went wrong '});
        }
        return res.status(200).json({message:'Code executed successfully',data:data});
    }catch(err){
        console.log(err)
        return res.status(500).json({message:'Internal server error'});
    }
}