const moment = require( 'moment');
const bcrypt = require('bcrypt');
const path = require('path');
const package_json = require('../package.json');

module.exports = class FoundationRequest {

    constructor(config_file_path) {
        this.config = this.loadConfig(config_file_path);
        this.user_agent = 'Lex-Machina-Foundation-Mapping-Tool/'+ package_json.version;
    }


 loadConfig(input_config_file_path){
    var config_file_path='';
    if (!input_config_file_path) {
        config_file_path =  '../config/foundation-config.json';
    } else {
        if (!path.isAbsolute(input_config_file_path)) {
            config_file_path = path.join(process.cwd(), input_config_file_path);
        } else {
            config_file_path = input_config_file_path;
        }
    }

    try {
        var config =  require(config_file_path);
    } catch (e){
        console.log(' Cannot load config file at ' + config_file_path);
        throw (e);
    }
    return config;
}

 getFoundationAuthenticationInformation() {
    var timestamp = moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSSSSSS[Z]');
    var string_to_hash = this.config.api_key + '|' + timestamp;
    
    console.log(string_to_hash);
    var hash = bcrypt.hashSync(string_to_hash, 6);
    console.log(hash);
    return [timestamp, hash];    
}

async  getFoundationURL(endpoint, query) {
    var [timestamp, hash] = getFoundationAuthenticationInformation();
    var options = {
        baseURL: 'https://partners.foundationsg.com',
        headers: {
            'Accept': 'application/json',
            'x-foundation-api-key':  API_KEY_NAME,
            'x-foundation-timestamp': timestamp,
            'x-foundation-api-auth': hash,
            'x-foundation-impersonate': API_USER,
            'User-Agent': this.user_agent
        },
        raxConfig: {
            retry: 3,
            httpMethodsToRetry: ['GET', 'HEAD', 'OPTIONS', 'DELETE', 'PUT', 'POST'],
            statusCodesToRetry: [[100, 199], [401, 401], [429,429], [500, 599]],
        }
        }
    //    var response = await axios("/api/v1/matter/14d8a6fa-4f3f-484a-a48e-9df3012fcb7f", options);
    var query = 'Person(((title~'+role+')))';
    //var query = 'Matter((OR(OR(matterOffice~Chicago)OR(matterOffice~London))))';
    var encodedQuery = encodeUriAll(query);
    console.log(encodedQuery);
    
    var skip=0;
    var take=10;
    var numberOfResults=0;
    //var response = await axios.get('/api/v1/contact/2f8d1aa6-c0f2-4783-8023-ea1b54d626b7', options);

    var response = await axios.get('/search/search?q='+encodedQuery+'&take='+take+'&skip='+skip, options);
    
}

}
