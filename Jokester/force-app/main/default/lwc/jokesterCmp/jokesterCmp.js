import { LightningElement, track } from "lwc";
import fetchCompletion from "@salesforce/apex/JokeGenerationController.handleCallout";
import BackgroundImg from "@salesforce/resourceUrl/openAI";
import createRating from "@salesforce/apex/JokeGenerationController.createRatingRec";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class MyComponent extends LightningElement {
  @track vehicleType = "car";
  @track ratingContainerClass = "rating-container hidden";

  @track texttocheck;
  @track responseReturned;
  @track showTextBox = false;
  @track selectedOption = "";
  @track starRating = 0;
  imageUrl = BackgroundImg;

  backgroundStyle = `background-image: url(${BackgroundImg}); background-repeat: no-repeat; background-size: cover;`;
  cardTitle = "Select an option";
  radioOptions = [
    { label: "Animals", value: "Animals" },
    { label: "Car", value: "Car" },
    { label: "Jobs", value: "Jobs" },
    { label: "Kids", value: "Kids" },
    { label: "Man", value: "Man" },
    { label: "Other", value: "Other" },
  ];

  @track showStars = false;
  @track rating = "";

  get getBackgroundImage() {
    return `background-image:url("${this.imageUrl}")`;
  }
  get options() {
    return [
      { label: "Animals", value: "Animals" },
      { label: "Car", value: "Car" },
      { label: "Jobs", value: "Jobs" },
      { label: "Kids", value: "Kids" },
      { label: "Man", value: "Man" },
      { label: "Other", value: "Other" },
    ];
  }

  assignData(event) {
    this.texttocheck = event.target.value;
  }
  
  handleSelect(event) {
    this.responseReturned = '';
    this.starRating = '';
    this.selectedOption = event.detail.value;

    console.log("evet:: " + event.detail.value);

    if (this.selectedOption === "Other") {
      this.showTextBox = true;
      handleOtherInputChange();
    } else {
      fetchCompletion({ texttoCheck: 'Joke on ' + this.selectedOption })
        .then((result) => {
          this.responseReturned = result;
          this.showStars = true;
          console.log("Rating: " + this.showStars);
        })
        .catch((error) => {
          console.log(JSON.stringify(error));
        });
      this.showTextBox = false;
    }
  }

  handleOtherInputChange() {
    fetchCompletion({ texttoCheck: this.texttocheck })
      .then((result) => {
        this.responseReturned = result;
        this.showStars = true;
        console.log("Rating: " + this.showStars);
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
      });
  }

  handleRatingChange(event) {
    this.starRating = event.target.value;
   
  }
  handleRating() {
    console.log("Rating:: " + this.starRating);
    if(this.starRating < 1 && this.starRating > 5){
        const event = new ShowToastEvent({
            title: "Error",
            message: "Please provide Rating between 1 to 5.",
            variant: "error",
          });
          this.dispatchEvent(event);
    }else{
        createRating({
            Category: this.selectedOption,
            Rating: this.starRating,
            Joke: this.responseReturned,
          })
          .then((result) => {
              const event = new ShowToastEvent({
                title: "Success",
                message: "Thank you for Your Rating.",
                variant: "success",
              });
              this.dispatchEvent(event);
            })
            .catch((error) => {
              const event = new ShowToastEvent({
                title: "Error",
                message: "Error in giving Rating",
                variant: "error",
              });
              this.dispatchEvent(event);
            });
    }
    
  }
}