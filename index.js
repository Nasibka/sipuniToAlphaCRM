const express =require('express');
const cors = require('cors');
const axios = require('axios')
const queryString = require('query-string');

const port = 7000;

const app = express();
app.use (cors());

app.get('/',(req,res)=>{
    console.log("Hello world")
})
app.get('/calls',(req,res)=>{
    // console.log(req.query, 17)
    const data = req.query
    const url ="https://chempionik.s20.online/api/1/sip/process?token=c4ca4238a0b923820dcc509a6f75849b"

    let timeInSeconds
    let record_url
    let dataForAxios

    console.log(data)

    if(data.treeName==='Входящая'){
        switch(data.event){
            case '1':
                if(data.dst_type==='1'){
                    console.log('Входящий звонок начался')
                    dataForAxios = {
                        event: 'alert',
                        call_id: data.call_id,
                        remote_number: data.src_num,
                        direction: 'in'
                    };
                }
                break 

            case '3':
                console.log('На входящий звонок ответили')
                dataForAxios = {
                    event: 'active',
                    call_id: data.call_id,
                    remote_number: data.src_num,
                    direction: 'in'
                };
                break

            case '2':
                console.log('Входящий звонок завершен')
                record_url = data.call_record_link
                timeInSeconds = parseInt(data.timestamp) - parseInt(data.call_start_timestamp)
                if(data.status==='NOANSWER'){
                    console.log('На звонок не ответили')
                    dataForAxios = {
                        event: 'release',
                        call_id: data.call_id,
                        remote_number: data.src_num,
                        direction: 'in',
                        local_number:data.dst_num,
                        duration:0,
                        is_success:0,
                        finish_reason:"Не успешно",
                        record_url:record_url
                    };
                }else if(data.status==='ANSWER'){
                    console.log('На звонок ответили')
                    dataForAxios = {
                        event: 'release',
                        call_id: data.call_id,
                        remote_number: data.src_num,
                        direction: 'in',
                        local_number:data.dst_num,
                        duration:timeInSeconds,
                        is_success:1,
                        finish_reason:"Успешно",
                        record_url:record_url
                    };
                }
                break
        }
        if(dataForAxios){
            axios({
                method: 'post',
                url: url,
                data: queryString.stringify(dataForAxios),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            })
                .then(function (response) {
                //handle success
                    console.log(response.data,109);
            })
                .catch(function (response) {
                //handle error
                    console.log(response.data);
            });
        }
    }
    else if(data.treeName==='Исходящая'){
        switch(data.event){
            case '1':
                if(data.dst_type==='1'){
                    console.log('Исходящий звонок начался')
                    dataForAxios = {
                        event: 'alert',
                        call_id: data.call_id,
                        remote_number: data.dst_num,
                        direction: 'out'
                    };
                }
                break 

            case '3':
                console.log('На исходящий звонок ответили')
                dataForAxios = {
                    event: 'active',
                    call_id: data.call_id,
                    remote_number: data.dst_num,
                    direction: 'in'
                };
                break

            case '2':
                console.log('Исходящий звонок завершен')
                record_url = data.call_record_link
                timeInSeconds = parseInt(data.timestamp) - parseInt(data.call_start_timestamp)
                if(data.status==='NOANSWER'){
                    console.log('На звонок не ответили')
                    dataForAxios = {
                        event: 'release',
                        call_id: data.call_id,
                        remote_number: data.dst_num,
                        direction: 'out',
                        local_number:data.short_src_num,
                        duration:0,
                        is_success:0,
                        finish_reason:"Не успешно",
                        record_url:record_url
                    };
                }else if(data.status==='ANSWER'){
                    console.log('На звонок ответили')
                    dataForAxios = {
                        event: 'release',
                        call_id: data.call_id,
                        remote_number: data.dst_num,
                        direction: 'out',
                        local_number:data.short_src_num,
                        duration:timeInSeconds,
                        is_success:1,
                        finish_reason:"Успешно",
                        record_url:record_url
                    };
                }
                break
        }
        if(dataForAxios){
            axios({
                method: 'post',
                url: url,
                data: queryString.stringify(dataForAxios),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            })
                .then(function (response) {
                //handle success
                    console.log(response.data,109);
            })
                .catch(function (response) {
                //handle error
                    console.log(response.data);
            });
        }
    }
    res.send({"success": true})
})

app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})


const data = {
    event: 'release',
    call_id: 1599036844.83813,
    remote_number: 77085170456,
    direction: 'in',
    local_number:"77470946621_id87957",
    duration:31,
    is_success:1,
    finish_reason:"Успешно",
    record_url:'https://sipuni.com/api/crm/record?id=1599036844.83809&hash=2075c9fbd4a408c6eec87e590eac0bbe&user=049342'
};

const url ="https://chempionik.s20.online/api/1/sip/process?token=c4ca4238a0b923820dcc509a6f75849b"

axios({
    method: 'post',
    url: url,
    data: queryString.stringify(data),
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    }
})
    .then(function (response) {
    //handle success
        console.log(response,108);
        console.log(response.data,109);
})
    .catch(function (response) {
    //handle error
        console.log(response.data);
});
