const Bull = require('bull');
const redis = require('redis');

// Create a new queue
const queue = new Bull('codeExecutionQueue', {
  redis: {
    host: '127.0.0.1',
    port: 6379
  }
});

// Define a job processor
queue.process(async (job) => {
  const { code, compiler, testcase, userID, questionId, unique, program } = job.data;

  let extra_params = {
    userID: userID,
    questionId: questionId,
    unique: unique,
    program: program,
    testcaseId: testcase._id.toString(),
    output: testcase.output,
  };

  let headersList = {
    Accept: "*/*",
    Authorization: process.env.ONLINE_COMPILER_KEY,
    "Content-Type": "application/json",
  };

  let bodyContent = JSON.stringify({
    code: code,
    input: testcase.input,
    compiler: compiler,
    extra_params: extra_params,
  });

  let response = await fetch("https://onlinecompiler.io/api/v2/run-code/", {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  });

  let data = await response.text();
  console.log(data);

  if (data !== "Ok") {
    throw new Error('Something went wrong');
  }

  return data;
});

module.exports = queue;
