public with sharing class JokeGenerationController {
    @AuraEnabled
    public static string handleCallout(string texttoCheck){
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint('https://api.openai.com/v1/completions');
        request.setMethod('POST');
        request.setHeader('Authorization', 'Bearer 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');
        request.setHeader('OpenAI-Organization', 'org-dzb7PFPEEos5hPsMP078l4Dk');
        request.setHeader('Content-Type','application/json');
        string requestBody = '{"model":"text-davinci-003","prompt":"'+texttoCheck+'","max_tokens":4000,"temperature":0}';
        request.setBody(requestBody);
        HttpResponse response = http.send(request);
        
        Map<String, Object> responseMap = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
        List<Object> choices = (List<Object>) responseMap.get('choices');
        Map<String, Object> firstMap = (Map<String, Object>)choices[0];
        String resultText = (String)firstMap.get('text');
        return resultText;
        
    }
    @AuraEnabled
    public static Joke_Rating__c createRatingRec(String Category,String Rating,String Joke){
        System.debug('call apex: '+Category+'::'+Rating+'::'+Joke);
        Joke_Rating__c jokeRating = new Joke_Rating__c(Name=Category,Rating__c=Decimal.valueOf(Rating),Joke__c=Joke);
        insert jokeRating;
        return jokeRating;
    }
}
