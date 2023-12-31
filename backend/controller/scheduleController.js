const BigPromise = require("../middleware/bigPromise");
const Task = require("../modals/task")
const Schedule = require("../modals/schedule_modal") ;
const _ = require("lodash") ;

const {findVoidIntervals, getCurrentTag, findEndTime} = require("../helper/taskTime") ;
const {accedingSortAccordingToProps, findDuration} = require("../helper/algorithms")

// function comp (a, b){
//     return a[2] - b[2] ;
// }

exports.getSchedule = BigPromise(async (req,res, next) => {
    const schedule = await Schedule.find();
    
    if(!schedule){
        return res.status(200).json({
            status: 200,
            message: "Schedule not found",
        });
    }

    return res.status(200).json({
        status: 200,
        message: "Schedule retrieved successfully",
        schedule
	});
})

exports.createSchedule = BigPromise(async (req, res, next) => {
    const userId = req.user.userId ;
    const tasks = await Task.find({userId}) ;

    if(!tasks){
        return res.status(404).json({
            status : 401,
            message : "No tasks found to create schedule",
        })
    }

    const date = new Date() ;
    const currTime = date.getHours() * 100 + date.getMinutes() ;

    const futureTasks = tasks.filter((task) => {
        return (task.startTime >= currTime || task.taskType === 'dynamic') ;
    });

    let staticTasks = futureTasks.filter((task) => {
        return task.taskType === 'static' ;
    });

    let dynamicTasks = futureTasks.filter((task) => {
        return task.taskType === 'dynamic' ;
    })

    let unUsedIntervals = findVoidIntervals(currTime, staticTasks) ;
    const currSuitableTag = getCurrentTag(currTime) ;

    dynamicTasks = accedingSortAccordingToProps(dynamicTasks, 'duration') ;
    // unUsedIntervals.sort(comp) ;
    
    let i = 0, j = 0 ;

    let taskSchedule = [] ;
    let copyTask = dynamicTasks[0] ;
    let currInterval = unUsedIntervals[0] ;

    taskSchedule.push(...staticTasks) ;

    while(i < dynamicTasks.length && j < unUsedIntervals.length){
        let currTask = copyTask ;

        if(currTask.duration <= currInterval[2]){
            currTask.startTime = currInterval[0] ;
            // currTask.endTime =  currInterval[1];
            currTask.endTime =  findEndTime(currInterval[0], currTask.duration);

            taskSchedule.push(currTask) ;

            currInterval = [currTask.endTime, currInterval[1], findDuration(currTask.endTime, currInterval[1])] ;

            i ++ ;
            copyTask = dynamicTasks[i] ;
        }
        else{
            // copyTask = currTask[i] ;
            currTask.startTime = currInterval[0] ;
            currTask.endTime = currInterval[1] ;
            taskSchedule.push(currTask) ;

            j ++ ;
            currInterval = unUsedIntervals[j] ;

            copyTask = JSON.parse(JSON.stringify(currTask)) ;

            copyTask.duration = currTask.duration - findDuration(currTask.startTime, currTask.endTime);
        }
    }

    accedingSortAccordingToProps(taskSchedule, 'startTime') ;

    const schedule = await Schedule.create({
        user : req.user,
        tasks : taskSchedule,
    })

    return res.status(200).json({
        status: 200,
        message: "Schedule created successfully",
        schedule
    })

})
