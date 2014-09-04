"use strict";
/*
# Copyright 2014 Open Ag Data Alliance
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
*/

var express = require('express');
var router = express.Router();

/* GET resource listing. */
router.get('/*', function(req, res) {

    //TODO: Check the Authentication Bearer
    var rest_path = req.params[0].split("/");
    var id = rest_path.shift();

    var res_object = {
        "_href": "https://" + req.headers.host + "/resources/" + id,
        "_etag": "aabbccdd", 
        "_changeId": "abcdef"
    }
    
    // Pull up document format template
    try{
        res_object = require('../documents/' + id + '.json');
        //walk through the requested REST Path
        for(var idx in rest_path){
            var child = rest_path[idx];
            if(!res_object.hasOwnProperty(child)){
                throw {"message": "The resource you requested does not exist."};
            }
            res_object = res_object[child];
            rest_path.shift();
        }
        //TODO: Actually putting data into the placeholder
    }catch(exp){
        //Send out error message for unsupported Resource ID
        res.json({
            "error": "unsupported resource",
            "reason": exp.message
        });
    }
    
    res.json(res_object);
});

module.exports = router;
