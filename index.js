// The provided course information.
const CourseInfo = {
    id: 451,
    name: "Introduction to JavaScript"
};

// The provided assignment group.
const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,
    group_weight: 25,
    assignments: [
        {
            id: 1,
            name: "Declare a Variable",
            due_at: "2023-01-25",
            points_possible: 50 
        },
        {
            id: 2,
            name: "Write a Function",
            due_at: "2023-02-27",
            points_possible: 150
        },
        {
            id: 3,
            name: "Code the World",
            due_at: "3156-11-15",
            points_possible: 500
        }
    ]
};

// The provided learner submission data.
const LearnerSubmissions = [
    {
        learner_id: 125,
        assignment_id: 1,
        submission: {
            submitted_at: "2023-01-25",
            score: 47
        }
    },
    {
        learner_id: 125,
        assignment_id: 2,
        submission: {
            submitted_at: "2023-02-12",
            score: 150
        }
    },
    {
        learner_id: 125,
        assignment_id: 3,
        submission: {
            submitted_at: "2023-01-25",
            score: 400
        }
    },
    {
        learner_id: 132,
        assignment_id: 1,
        submission: {
            submitted_at: "2023-01-24",
            score: 39
        }
    },
    {
        learner_id: 132,
        assignment_id: 2,
        submission: {
            submitted_at: "2023-03-07",
            score: 140
        }
    }
];
//======================================================Functions============================================
// Give it an an assignment id and it will return the assignment object from the assignment group 
function AssignmentEntry(ag, n) {
    let assignment_entries = ag.assignments.filter(element => element.id === n)[0];
    return assignment_entries;
}

// Function that restructures the submission data to regroup based on the learners'd ID
function LearnerSubmissionGrouped(submissions) {
    const submissions_by_id = submissions.reduce((groupedById, item) => {
        const learner_id_value = item.learner_id;
        // create this new property in the acc object if it doesnt exist already
        if (groupedById[learner_id_value] == null) {
            groupedById[learner_id_value] = [];
        }
        delete item.learner_id;
        groupedById[learner_id_value].push(item);
        return groupedById;
    }, {})
    return submissions_by_id;
}

function getLearnerData(course, ag, submissions) {
    const result_data = [];
    //First step is to check whether the assignment group provided belongs to the course info. 
    try {
        if (ag.course_id !== course.id) {
            throw "Assignment group doesn't belong to that course ID"
        }
    }
    catch (error) {
        console.log("wrong Input" + error)
        return;
    }
    //  Reformat the submissions data into an object of learners with submission for alll their homeworks
    const submissions_grouped_by_id = LearnerSubmissionGrouped(LearnerSubmissions);

    // array that holds the number of group of learners substitution
    const learners = Object.keys(submissions_grouped_by_id);
    // looping through learners submissions
    let i = 0; 
    while (i < learners.length) {
        const entry = []
        let total_point = 0;
        let learner_cumul = 0;
        entry.push(["id", learners[i]]);
        // copy the results from that assigment block to the id variable 
        let assignment_block = submissions_grouped_by_id[learners[i]];
        // Gather the info of that particular assignment the learner submitted
        for (let j = 0; j < assignment_block.length; j++) {
            let assignment_entry = AssignmentEntry(ag, assignment_block[j].assignment_id);
            // check if the submitted assignment was submitted on time 
            if ((assignment_block[j].submission.submitted_at <= assignment_entry.due_at) && (assignment_entry.due_at <= "2024-10-07")) {
                try {
                    if (assignment_entry.points_possible === 0) {
                        throw "Number of points possible cannot be equal to 0!";
                   }
                   else {
                        entry.push([[assignment_entry.id], assignment_block[j].submission.score / assignment_entry.points_possible]);
                        learner_cumul += assignment_block[j].submission.score;
                        total_point += assignment_entry.points_possible;
                 }
                }
                catch (error) {
                    console.log('Oh no! Wrong input, please check data! ', error);
                    return;
                }
            }
            // If submitted late deduct 10%
            else if ((assignment_block[j].submission.submitted_at > assignment_entry.due_at) && (assignment_entry.due_at <= "2024-10-07")) {
                try {
                    if (assignment_entry.points_possible === 0 ) {
                        throw error
                    }
                    {
                        entry.push([[assignment_entry.id], ((assignment_block[j].submission.score / assignment_entry.points_possible) * 0.90).toFixed(3)]);
                        learner_cumul += assignment_block[j].submission.score * 0.90;
                        total_point += assignment_entry.points_possible;
                    }
                }
                catch (error) {
                    console.log('Oh no! Wrong input, please check data! ', error);
                    return;
                }
            }

        }
        entry.push(['avg', learner_cumul / total_point]);
        const obj = Object.fromEntries(entry);
        result_data.push(obj);
        i++;
    }

    return result_data;
}


const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
console.log(result);