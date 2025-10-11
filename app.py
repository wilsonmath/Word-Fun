import requests
def word_finder():
    api_word = "https://random-word-api.herokuapp.com/word"
    response = requests.get(api_word).json()
    return response[0]
def definition(response):
    api = "https://api.dictionaryapi.dev/api/v2/entries/en/" + response
    answer = requests.get(api).json()
    if isinstance(answer, list) and len(answer) > 0:
        print("Your word is "+ word)
        for num in range(len(answer)):
            defi = answer[num]["meanings"]
            print("Part of Speech:   " + defi[0]['partOfSpeech'])
            print("Definitions: ")
            for i in range(len(defi[0]['definitions'])):
                final_definition = defi[0]['definitions'][i]["definition"]
                final_partofspeech = defi[0]['partOfSpeech']
            
                print(str(i+1)+". " + defi[0]['definitions'][i]["definition"])

            print("Synonyms : ")
            synonyms = defi[0]["synonyms"]
            if len(synonyms) > 0 :
                print(synonyms)
            else:
                print("N/A")
            print("Antonyms : ")
            antonyms = defi[0]["antonyms"]
            if len(antonyms) > 0 :
                print(antonyms)
            else:
                print("N/A")
    else:
        return False
bo = True
print("Learn new words")
while bo:
    word = word_finder()
    if definition(word) != False:
        bo = False
