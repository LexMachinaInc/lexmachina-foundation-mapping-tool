var chai = require('chai');
const expect = chai.expect;

const FoundationRequest = require("../src/foundation-request.js")

describe('Config and Basics', () => {

    describe('User Agent', () => {
        it('should include version in user agent', () => {
            const request = new FoundationRequest();
            console.log(request);
            expect(request.user_agent).to.include("Lex-Machina-Foundation-Mapping-Tool");
        });
    });

    describe('Config Files', ()=> {
        it('should be able to access non-default file constructor', () => {
            const request = new FoundationRequest('./config/config-notdefault.json');
            expect(request.config.api_key).to.not.be.empty;
        });

        it('should be able to access relative path file constructor', () => {
            const request = new FoundationRequest('./config/config-notdefault.json');
            expect(request.config.api_key).to.not.be.empty;
        });

        it('should throw error with nonexistent file constructor', () => {
            function badConfigFile() {
                const request = new FoundationRequest('../config/nonexistent.json');
            }
            expect(badConfigFile).to.throw();
        });

    });

    describe('Authentication Token', () => {
        it('should create Foundation authentication token', async () => {
            const request = new FoundationRequest();
            var [timestamp, hash] = request.getFoundationAuthenticationInformation();
            expect(hash).to.not.be.empty;
            expect(timestamp).to.not.be.empty;
        });
    });

});

