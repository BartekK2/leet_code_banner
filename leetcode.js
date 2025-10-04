//graphql query
const query = `
  query getUserProfile($username: String!) {
    allQuestionsCount {
      difficulty
      count
    }
    matchedUser(username: $username) {
      submissionCalendar
      submitStats {
        acSubmissionNum {
          difficulty
          count
        }
      }
    }
  }
`;

// format data 
const formatData = (data) => {
    return {
        easySolved: data.matchedUser.submitStats.acSubmissionNum.find(d => d.difficulty === "Easy")?.count || 0,
        totalEasy: data.allQuestionsCount.find(d => d.difficulty === "Easy")?.count || 0,
        mediumSolved: data.matchedUser.submitStats.acSubmissionNum.find(d => d.difficulty === "Medium")?.count || 0,
        totalMedium: data.allQuestionsCount.find(d => d.difficulty === "Medium")?.count || 0,
        hardSolved: data.matchedUser.submitStats.acSubmissionNum.find(d => d.difficulty === "Hard")?.count || 0,
        totalHard: data.allQuestionsCount.find(d => d.difficulty === "Hard")?.count || 0,
        submissionCalendar: JSON.parse(data.matchedUser.submissionCalendar || '{}')
    };
};

//fetching the data
exports.leetcode = (req, res) => {
    const user = req.params.id;
    fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Referer': 'https://leetcode.com'
        }, 
        body: JSON.stringify({query: query, variables: {username: user}}),
    })
    .then(result => result.json())
    .then(data => {
        if(data.errors){
            res.send(data);
        } else {
            res.send(formatData(data.data));
        }
    })
    .catch(err => {
        console.error('Error', err);
        res.send(err);
    });
};
