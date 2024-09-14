const problems = require('../models/problems');

exports.execute = async (req, res) => {
    try {
        const { code, compiler, questionId, unique, program } = req.body;
        const userID = req.user;
        
        const problem = await problems.findById({ _id: questionId });
        if (!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }
        
        const examples = problem.testcase;
        const results = [];

        for (const testcase of examples) {
            const extra_params = {
                userID: userID,
                input: testcase.input,
                questionId: questionId,
                unique: unique,
                program: program,
                testcaseId: testcase._id.toString(),
                output: testcase.output,
            };
            
            const headersList = {
                Accept: "*/*",
                Authorization: process.env.ONLINE_COMPILER_KEY,
                "Content-Type": "application/json",
            };
            const bodyContent = JSON.stringify({
                code: code,
                input: testcase.input,
                compiler: compiler,
                extra_params: extra_params,
            });

            let response;
            try {
                response = await fetch("https://onlinecompiler.io/api/v2/run-code/", {
                    method: "POST",
                    body: bodyContent,
                    headers: headersList,
                });
            } catch (error) {
                console.error('Fetch error:', error);
                return res.status(500).json({ message: 'Internal server error during fetch' });
            }

            const data = await response.text();
            if (data !== "Ok") {
                return res.status(500).json({ message: 'Something went wrong with the compiler response' });
            }

            results.push({ testcaseId: testcase._id.toString(), result: data });
        }

        return res.status(200).json({ message: 'Code executed successfully', results: results });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
