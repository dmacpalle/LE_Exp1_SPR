PennController.ResetPrefix(null);
// PennController.DebugOff() // use for the final version

// --------------------------------------------------------------------------------------------------------------
// Preamble

// sequence
PennController.Sequence( "practice", "instructions2", subsequence(repeat(shuffle(randomize("critical"), randomize("filler")), 25) , "break"), "post-instructions", "post-ques", "post-task-intro", "post-task",  "send", "final");
//PennController.Sequence( "demographics", "instructions1", "practice", "instructions2", subsequence(repeat(shuffle(randomize("critical"), randomize("filler")), 25) , "break"), "post-instructions", "post-ques", "post-task-intro", "post-task",  "send", "final");

// create dashed function
dashed = (sentence, remove) => {
    let words = sentence.split('*'),  blanks = words.map(w=>w.split('').map(c=>'_').join('') );
    let textName = 'dashed'+words.join('');
    // We'll return cmds: the first command consists in creating (and printing) a Text element with dashes
    let cmds = [ newText(textName, blanks.join(' ')).print() .settings.css("font-family","courier") .settings.css("font-size", "20px")]; // COURIER as font
    // We'll go through each word, and add two command blocks per word
    for (let i = 0; i <= words.length; i++)
    cmds = cmds.concat([ newKey('dashed'+i+words[i], " ").log().wait() , // Wait for (and log) a press on Space
    getText(textName).text(blanks.map((w,n)=>(n==i?words[n]:w)).join(' ')) ]); // Show word
    if (remove)  // Remove the text after the last key.wait() is parameter specified
    cmds.push(getText(textName).remove());
    return cmds;
};

//====================================================================================================================================================================================================================
// 1. Welcome page/demographics

PennController("demographics",
               newText("welcometext", "<p><b>Welcome to our experiment!</b><p> <p>Before you begin the experiment, please need some basic information about you. This data is anonymous. More information about our how we handle your data can be found in the <i>Participant's Information Sheet</i>' below.<p>")              
               .settings.css("font-size", "20px")
               ,
               newCanvas("welcomecanvas", 1000, 125)
               .settings.add(0, 0, getText("welcometext") )
               .print()
               ,
               newDropDown("age", "")
               .settings.add( "17 or under" , "18" , "19" , "20", "21" , "22" , "23", "24" , "25" , "26", "27" , "28" , "29", "30" , "31" , "32+" )
               ,
               newText("agetext", "Age:")
               .settings.css("font-size", "20px")
               .settings.bold()
               //        .settings.after( getDropDown("age") )    
               ,
               newCanvas("agecanvas", 1000, 45)
               .settings.add(0, 10, getText("agetext") )
               .settings.add(100, 8, getDropDown("age") )
               .print()    
               ,
               newText("gender", "Gender:")
               .settings.css("font-size", "20px")
               .settings.bold()
               ,
               newDropDown("sex", "" )
               .settings.add( "female", "male", "other", "prefer not to disclose")
               ,
               newCanvas("sexcanvas", 1000, 40)
               .settings.add(0, 0, getText("gender") )
               .settings.add(120, 3, getDropDown("sex") )
               .print()
               ,
               newText("firstlang", "Did you learn/speak/understand any language besides English before the age of 6?")
               .settings.css("font-size", "20px")
               .settings.bold()
               ,
               newTextInput("und zwar", "")
               .settings.hidden()
               ,
               newText("label input", "")
               .settings.after( getTextInput("und zwar") )
               ,
               newDropDown("language", "")
               .settings.log()
               .settings.add(  "no", "yes, I also learned:")    
               .settings.after(  getText("label input") )
               .settings.callback(                                             //whenever an option is selected, do this:
                   getDropDown("language")
                   .test.selected("yes, I also learned:")                             //reveal the input box
                   .success( getTextInput("und zwar").settings.visible() )     //hide the input box
                   .failure( getTextInput("und zwar").settings.hidden()  )   
               )        
               ,
               newCanvas("languagecanvas", 1000, 25)
               .settings.add(0, 0, getText("firstlang") )
               .settings.add(750, 2, getDropDown("language") )
               .print()
               ,
               newText("<p> ")
               .print()
               ,    
               newText("information", "<p>Before beginning the experiment, please read the <a href='https://amor.cms.hu-berlin.de/~pallesid/LE_Exp1_spr/LE1_SPR_info_sheet_final.pdf' target='_blank' >Participant's Information Sheet</a> as well as <a href='https://amor.cms.hu-berlin.de/~pallesid/LE_Exp1_spr/LE1_SPR_consentAgreement_final.pdf' target='_blank' >the Consent Form.</a><p>")
               .settings.css("font-size", "20px")
               ,
               newCanvas("infocanvastwo", 1000, 80)
               .settings.add(0, 0, getText("information") )
               .print()
               ,
               newText("browser_info", "<p>Please note that this experiment has only been tested on <b>Mozilla Firefox</b> and <b>Google Chrome</b>, and will not work on mobile phones.<p>")
               .settings.css("font-size", "20px")
               ,
               newCanvas("infocanvasthree", 1000, 115)
               .settings.add(0, 0, getText("browser_info") )
               .print()
               ,
               newButton("okay", "By clicking this button, I declare I have fully read and understood the Participant's Information Sheet and Consent Form.")
               .settings.css("font-size", "15px")        
               .print()
               .wait()  
               ,
               newText("<p> ")
               .print()  
               ,
               newButton("start", "Continue to the experiment")
               .settings.center()  
               ,
               getDropDown("age")
               .test.selected()
               .success()
               .failure(
                   newText("Please indicate your age.")
                   .settings.color("red")
                   .print())   
               ,
               getDropDown("sex")
               .test.selected()
               .success()
               .failure(
                   newText("Please indicate your gender.")
                   .settings.color("red")
                   .print())
               ,
               getDropDown("language")
               .test.selected()
               .success()
               .failure(
                   newText("Please answer the question about your language history.")                   
                   .settings.color("red")
                   .print())      
               ,
               getDropDown("age").wait("first")
               ,
               getDropDown("sex").wait("first")
               ,
               getDropDown("language").wait("first")
               ,
               getButton("start")
               .print()
               .wait()
               ,   
               newVar("IDage")
               .settings.global()
               .set( getDropDown("age") )
               ,
               newVar("IDsex")
               .settings.global()
               .set( getDropDown("sex") )
               ,
               newVar("IDling")
               .settings.global()
               .set( getDropDown("language") )
               ,
               newVar("IDund zwar")
               .settings.global()
               .set( getTextInput("und zwar") )
              )                                 //end of welcome screen
    
    .log("age", getVar("IDage"))
    .log("sex", getVar("IDsex"))
    .log("L2", getVar("IDling"))
    .log("whichL2", getVar("IDund zwar"))
    
    .setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);

//====================================================================================================================================================================================================================
// 2. Intro/instructions

PennController( "instructions1" ,
                newText("intro", "<p><b>Thank you for taking part in our experiment!</b><p> The experiment consists of four parts: a short practice round, the experiment itself, and then two short post-experiment questionnaires. The whole process should take around 15 minutes.<p><p> Press the <b>spacebar</b> to continue to the instructions.<p><p>")
                .settings.css("font-size", "20px")
                ,
                newCanvas("introcanvas",900, 450)
                .settings.add(0,0, getText("intro"))
                .print()   
                ,
                newKey("intro"," ")
                .wait()
                ,
                getCanvas("introcanvas")
                .remove()
                ,
                newTimer("intro", 500)
                .start()
                .wait()
                ,                
                newText("instructions", "<p>In this experiment, you will be reading sentences.<p>A short biography of cultural figures from around the world will appear. You may be very familiar with some cultural figures, and not very familiar with others. <p>Once you have read the short biography press the <b>spacebar</b> to continue. You will then see a new sentence in chunks which describes a past, present, or future accomplishment of the cultural figures. You will only see one sentence chunk at a time, moving from left to right. To move to the next chunk, press the spacebar. <p> After this sentence, you will be presented with a rating scale. Your task is to decide how well the last sentence fits naturally with the previous mini-biography from 1 (definitely wrong) to 7 (perfectly fine). Some of the sentences will fit perfectly, others will be clearly wrong, and some might be somewhere in between. Once you've rated the sentence, press the <b>spacebar</b> to continue.<p><p>You’ll now start a practice round. When you’re ready to start, press the <b>spacebar</b>. <p>")
                .settings.css("font-size", "20px")
                ,
                newCanvas("instruccanvas",900, 450)
                .settings.add(0,0, getText("instructions"))
                .print()   
                ,
                newKey("prac_start"," ")
                .wait()
               )
    .log("age", getVar("IDage"))
    .log("sex", getVar("IDsex"))
    .log("L2", getVar("IDling"))
    .log("whichL2", getVar("IDund zwar"))
    
    .setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);

//====================================================================================================================================================================================================================
// Practice items


PennController.Template(PennController.GetTable("practice.csv"),
                        variable => ["practice",
                                     "PennController", PennController(
                                         defaultText
                                         .settings.css("font-family","courier")
                                         ,
                                         newCanvas("dots", 600, 200)
                                         .print()
                                         ,
                                         
                                         newText("dots", "...")
                                         .print()
                                         .settings.center()
                                         ,
                                         newTimer("dots", 500)
                                         .start()
                                         .wait()
                                         ,
                                         getText("dots")
                                         .remove()
                                         ,
                                         getCanvas("dots")
                                         .remove()
                                         ,
                                         newCanvas("bio_instructions", 600, 200)
                                         .center()
                                         //.add( 0, 0, newText("description","This is a square") )
                                         .add("center at 50%","middle at 50%",newText ("bio_instru","<i>Read the short biography and <b>press spacebar</b> to continue</i>")
                                              .settings.css("font-size", "15px")
                                              .settings.center()
                                              .settings.css("font-family","times new roman")
                                              .settings.color("red"))
                                         .print()
                                         ,
                                         newText("bio", variable.bio)
                                         .print()
                                         .settings.center()
                                         .settings.css("font-family","courier")
                                         .settings.css("font-size", "20px")
                                         ,
                                         
                                         newTimer("bio", 1000)
                                         .start()
                                         .wait()
                                         ,                                         
                                         newKey("biospace", " ")
                                         .wait()
                                         ,
                                         getText("bio")
                                         .remove()
                                         ,
                                         getCanvas("bio_instructions")
                                         .remove()
                                         ,
                                         newCanvas("crit_instructions", 600, 200)
                                         .center()
                                         .add("center at 50%","middle at 50%",newText ("crit_instru","<i><b>Press the spacebar</b> to reveal the next chunk</i>")
                                              .settings.css("font-size", "15px")
                                              .settings.center()
                                              .settings.css("font-family","times new roman")
                                              .settings.color("red"))
                                         .print()
                                         
                                         ,     
                                         ...dashed(variable.critical, "remove")
                                     
                                     ,
                                     getCanvas("crit_instructions")
                                     .remove()
                                     //...dashed(variable.critical, "remove")
                                     ,
                                     newCanvas("bio_instructions", 800, 200)
                                     .center()
                                     .add("center at 50%","middle at 50%",newText ("scale_title", "<i>Given the preceding biography, how natural did you find the last sentence?</i>")
                                          .settings.css("font-size", "15px")
                                          .settings.center()
                                          .settings.css("font-family","times new roman")
                                          .settings.color("red"))
                                     .print()
                                     ,
                                     newScale("rating", 7)
                                     .settings.before( newText("left", "definitely wrong") .settings.css("font-family","times new roman"))
                                     .settings.after( newText("right", "perfectly fine") .settings.css("font-family","times new roman"))
                                     //.print()
                                     //.wait()
                                     ,
                                     newCanvas("introcanvas", 380,50)
                                     //.settings.css( "border" , "solid 1px black" )
                                     .settings.center()
                                     .settings.add("center at 50%", "middle at 50%", getScale("rating") )
                                     .print()
                                     ,
                                     getScale("rating")
                                     .wait()
                                     ,
                                     newText("finish", "<p><p><i>Press the spacebar to continue.</i>") 
                                     .settings.css("font-family","times new roman")
                                     .settings.color("red")
                                     .settings.center()
                                     .print()
                                     ,
                                     newKey("finish"," ")
                                     .wait()
                                     ,   
                                     getText("finish")
                                     .remove()  
                                     ,      
                                     /*getScale("rating")
                                     .remove() */
                                     getCanvas("introcanvas")
                                     .remove()
                                     ,      
                                     getText("scale_title")
                                     .remove()
                                     ,         
                                     newText("pleasewait2", "Please wait for the next biography.")
                                     .settings.css("font-family","times new roman")
                                     .settings.center()
                                     .print()
                                     ,
                                     newTimer("wait", 1000)
                                     .start()
                                     .wait()
                                     ,
                                     getText("pleasewait2")
                                     .remove()
                                     ,
                                     newVar("rating") // this will create a new variable "ID"; MUST be after the 'Start' button click
                                     .settings.global()
                                     .set(getScale("rating") ) // setting the value of "ID" to be the input from "ID above"
                                     )
                                     .log("age", getVar("IDage"))
                                     .log("sex", getVar("IDsex"))
                                     .log("L2", getVar("IDling"))
                                     .log("whichL2", getVar("IDund zwar"))
                                     .log("type", variable.type)
                                     .log("lifetime" , variable.life_status)
                                     .log("tense", variable.tense)
                                     .log("mm", variable.mm)
                                     .log("rating", getVar("rating"))
                                     .log("item" , variable.item_id) 
                                     .log("name" , variable.name)  
                                     .log("list", variable.list)
                                     
                                    ]
                        
                       );
//====================================================================================================================================================================================================================
// 4. Post-practice Instructions
PennController( "instructions2" ,
                newText("intro_experiment", "<p>That's the end of the practice round. You can now start the actual experiment. <p> <p>The red instructions that appeared for the practice ratings (i.e., <i>Given the preceding context...</i>, and <i> Press the spacebar to continue</i>) will no longer appear.<p> There will be a short break halfway through the experiment.<p><b><i>Please refrain from Googling a cultural figure during the experiment or during the break!</i></b>")
                .settings.css("font-size", "20px")
                .print()
                ,
                newCanvas("instructions_canvas",900, 555)
                .settings.add(0, 0, getText("intro_experiment") )
                ,
                newButton("start_experiment3" ,"Continue to the experiment")
                .settings.center()
                .print()
                .wait()
                ,
                getCanvas("instructions_canvas")
                .remove()
                ,
                getButton("start_experiment3")
                .remove()
                ,
                newText("instructions_key", "<br><b>Press the spacebar to start the experiment.</b></br>")
                .settings.css("font-size", "20px")
                .settings.center()
                .print()
                ,
                newKey("continue", " ")
                .wait()
                ,  
                getText("instructions_key")
                .remove()
                ,
                getText("intro_experiment")
                .remove()
                ,
                newTimer(1000)
                .start()
                .wait()                
               )                                 //end of experiment instructions screen   
    .log("age", getVar("IDage"))
    .log("sex", getVar("IDsex"))
    .log("L2", getVar("IDling"))
    .log("whichL2", getVar("IDund zwar"))
    
    .setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);

//====================================================================================================================================================================================================================
// Critical items

PennController.Template( PennController.GetTable("master_spr.csv"), // use subset.csv for celebrity names
                         variable => ["critical",
                                      "PennController", PennController(
                                          defaultText
                                          .settings.css("font-family","courier")
                                          ,
                                          newCanvas("dots", 600, 200)
                                          .print()
                                          ,
                                          newText("dots", "...")
                                          .print()
                                          .settings.center()
                                          ,
                                          newTimer("dots", 500)
                                          .start()
                                          .wait()
                                          ,
                                          getText("dots")
                                          .remove()
                                          ,
                                          newText("bio", variable.bio)
                                          .print()
                                          .settings.center()
                                          .settings.css("font-size", "20px")
                                          .settings.css("font-family","courier")
                                          ,
                                          newTimer("bio", 1000)
                                          .start()
                                          .wait()
                                          ,
                                          newKey("biospace", " ")
                                          .wait()
                                          ,
                                          getText("bio")
                                          .remove()
                                          ,
                                          ...dashed(variable.critical, "remove")
                                      ,
                                      newScale("rating", 7)
                                      .settings.before( newText("left", "definitely wrong") .settings.css("font-family","times new roman"))
                                      .settings.after( newText("right", "perfectly fine") .settings.css("font-family","times new roman"))
                                      .settings.center()
                                      .print()
                                      .wait()
                                      ,
                                      newKey("ratingkey", " ")
                                      .wait()
                                      ,
                                      getScale("rating")
                                      .remove() 
                                      /*,      
                                      getText("scale_title")
                                      .remove() */
                                      ,         
                                      newText("pleasewait2", "Please wait for the next biography.")  
                                      .settings.center()
                                      .settings.css("font-family","times new roman")
                                      .print()
                                      ,
                                      newTimer("wait", 1000)
                                      .start()
                                      .wait()
                                      ,
                                      getText("pleasewait2")
                                      .remove()
                                      ,
                                      newVar("rating") // this will create a new variable "ID"; MUST be after the 'Start' button click
                                      .settings.global()
                                      .set(getScale("rating") ) // setting the value of "ID" to be the input from "ID above"
                                      )
                                      .log("age", getVar("IDage"))
                                      .log("sex", getVar("IDsex"))
                                      .log("L2", getVar("IDling"))
                                      .log("whichL2", getVar("IDund zwar"))
                                      .log("type", variable.type)
                                      .log("lifetime" , variable.life_status)
                                      .log("tense", variable.tense)
                                      .log("mm", variable.mm)
                                      .log("rating", getVar("rating"))
                                      .log("item" , variable.item_id) 
                                      .log("name" , variable.name)  
                                      .log("list", variable.list)    
                                      .log("bare_verb", variable.bare)                               
                                     ]
                        );

//====================================================================================================================================================================================================================
// Filler items

PennController.Template( PennController.GetTable("fillers.csv"),
                         variable => ["filler",
                                      "PennController", PennController(
                                          defaultText
                                          .settings.css("font-family","courier")
                                          ,
                                          newCanvas("dots", 600, 200)
                                          .print()
                                          ,
                                          newText("dots", "...")
                                          .print()
                                          .settings.center()
                                          ,
                                          newTimer("dots", 500)
                                          .start()
                                          .wait()
                                          ,
                                          getText("dots")
                                          .remove()
                                          ,
                                          newText("bio", variable.bio)
                                          .print()
                                          .settings.center()
                                          .settings.css("font-size", "20px")
                                          .settings.css("font-family","courier")
                                          ,
                                          newTimer("bio", 1000)
                                          .start()
                                          .wait()
                                          ,
                                          newKey("biospace", " ")
                                          .wait()
                                          ,
                                          getText("bio")
                                          .remove()
                                          ,
                                          ...dashed(variable.criticalfiller, "remove")
                                      ,
                                      /*newText("scale_title", "How natural did you find this sentence?")
                                      .settings.css("font-family","times new roman")
                                      .settings.center()
                                      .print()
                                      ,*/
                                      newScale("rating", 7)
                                      .settings.before( newText("left", "definitely wrong") .settings.css("font-family","times new roman"))
                                      .settings.after( newText("right", "perfectly fine") .settings.css("font-family","times new roman"))
                                      .settings.center()
                                      .print()
                                      .wait()
                                      ,
                                      newKey("ratingkey", " ")
                                      .wait()
                                      ,
                                      getScale("rating")
                                      .remove()  
                                      /*,      
                                      getText("scale_title")
                                      .remove() */
                                      ,         
                                      newText("pleasewait2", "Please wait for the next biography.")
                                      .settings.css("font-family","times new roman")
                                      .settings.center()
                                      .print()
                                      ,
                                      newTimer("wait", 1000)
                                      .start()
                                      .wait()
                                      ,
                                      getText("pleasewait2")
                                      .remove()
                                      ,
                                      newVar("rating") // this will create a new variable "ID"; MUST be after the 'Start' button click
                                      .settings.global()
                                      .set(getScale("rating") ) // setting the value of "ID" to be the input from "ID above"
                                      )
                                      .log("age", getVar("IDage"))
                                      .log("sex", getVar("IDsex"))
                                      .log("L2", getVar("IDling"))
                                      .log("whichL2", getVar("IDund zwar"))
                                      .log("type", variable.type)
                                      .log("lifetime" , variable.life_status)
                                      .log("tense", variable.tense)
                                      .log("mm", variable.mm)
                                      .log("rating", getVar("rating"))
                                      .log("item" , variable.item_id) 
                                      .log("name" , variable.name)  
                                      .log("list", variable.list)
                                     ]
                        );

//====================================================================================================================================================================================================================
// 6. Break

PennController( "break" ,
                newText("break_text", "<p><b>Time for a short break!</b> <br><p>This break will end after 20 seconds. If you'd like to skip the break and go straight back to the experiment, <b>press the spacebar</b>.<p>")
                .settings.css("font-size", "20px")
                .settings.center()
                .print()    
                ,
                newTimer("break_timer", 20000)
                .start()                
                ,
                newKey("continue_exp", " ")                 
                .callback( getTimer("break_timer").stop() )   
                ,
                getTimer("break_timer")
                .wait("first")
                ,
                getText("break_text")
                .remove()                
                ,
                getKey("continue_exp")
                .remove()   
                ,
                newText("instructions_key2", "<br><b>Press the spacebar to continue to the experiment.</b></br>")
                .settings.css("font-size", "20px")
                .settings.center()
                .print()
                ,
                //F-Version:
                newKey("end_break", " ")
                //J-Version:
                //newKey("continue_Ja", "J")
                .wait()
                ,  
                getText("instructions_key2")
                .remove()                  
                ,
                newTimer(1000)
                .start()
                .wait()             
               )    
    
    .setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);

//====================================================================================================================================================================================================================
// 2. Post-task instructions

PennController( "post-instructions",
                newText("post_instructions", "<p><b>That concludes the experiment!</b><p> <p>Before we let you go, we have two short tasks for you. <p>The first is a questionnaire about the experiment you just did.<p><p>Press the spacebar to continue to the questionnaire.")                         
                .settings.css("font-size", "20px")
                ,
                newCanvas("introcanvas",900, 450)
                .settings.add(0,0, getText("post_instructions"))
                .print()   
                ,
                newKey("post_start"," ")
                .wait()
               )
    .log("age", getVar("IDage"))
    .log("sex", getVar("IDsex"))
    .log("L2", getVar("IDling"))
    .log("whichL2", getVar("IDund zwar"))
    
    .setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);



// --------------------------------------------------------------------------------------------------------------
// 3. Post-experiment questionnaire

PennController("post-ques",
               newText("post-instruc", "Please answer the following questions about the experiment. <br>Try to be brief but informative.<p><p>")
               .settings.bold()
               .print()
               ,
               // Q1
               newText("notice", "1. Was there anything about the experiment that stood out to you? Any patterns/regularities, anything strange or surprising?")
               .print()
               ,
               newTextInput("notice","")
               .size(600,50)
               .print()
               .log()
               ,
               newText("blank", "<p>")
               .print()
               ,
               newButton("next1", "Next Question")
               .print()
               .wait()
               ,
               getButton("next1")
               .remove()
               ,
               // Q2
               newText("about", "2. What do you think the experiment might have been about? Make as many guesses as you like.")
               .print()
               ,
               newTextInput("about","")
               .size(600, 50)
               .print()
               .log()
               ,   
               newText("blank", "<p>")
               .print()
               ,            
               newButton("next2", "Next Question")
               .print()
               .wait()
               ,
               getButton("next2")
               .remove()
               ,
               //Q3
               newText("easyhard", "3. Was there anything you found particularly easy or difficult?")
               .print()
               ,
               newTextInput("easyhard","")
               .size(600, 50)
               .print()
               .log()
               ,     
               newText("blank", "<p>")
               .print()
               ,            
               newButton("next3", "Next Question")
               .print()
               .wait()
               ,
               getButton("next3")
               .remove()
               ,
               // Q4
               newText("strategy", "4. Did you use any strategies during the experiment? If so, what were they?")
               .print()
               ,
               newTextInput("strategy","")
               .size(600, 50)
               .print()
               .log()
               ,   
               newText("blank", "<p>")
               .print()
               ,              
               newButton("next4", "Finished")
               .print()
               .wait()
               ,
               // create Vars
               newVar("notice") // this will create a new variable "ID"; MUST be after the 'Start' button click
               .settings.global()
               .set(getTextInput("notice") )
               ,
               newVar("about") // this will create a new variable "ID"; MUST be after the 'Start' button click
               .settings.global()
               .set(getTextInput("about") )
               ,
               newVar("easyhard") // this will create a new variable "ID"; MUST be after the 'Start' button click
               .settings.global()
               .set(getTextInput("easyhard") )
               ,
               newVar("strategy") // this will create a new variable "ID"; MUST be after the 'Start' button click
               .settings.global()
               .set(getTextInput("strategy") )
              )    
    .log("age", getVar("IDage"))
    .log("sex", getVar("IDsex"))
    .log("L2", getVar("IDling"))
    .log("whichL2", getVar("IDund zwar"))
    .log("post-ques1", getVar("notice"))
    .log("post-ques2", getVar("about"))
    .log("post-ques3", getVar("easyhard"))
    .log("post-ques4", getVar("strategy")) 
    
    ;

//====================================================================================================================================================================================================================
// 7. Comprehension test explanation screen // 14.05.2020 PM added and changed numbering; should this count towards progress?

PennController( "post-task-intro",
                newText("comp1_1", "<p>Thank you for your feedback! We have a final task for you to complete before you are presented with your ClickWorker validation code.</b>")
                .settings.css("font-size", "20px")
                ,        
                newText("comp1_2", "You will be presented with a list of names of cultural figures. Some of them were included in the experiment, some were not. <b>Please indicate whether you're familiar with each cultural figure</b>, regardless of whether or not the name appeared in the experiment. <p>After you have made your selections, you can retrieve your ClickWorker validation code by clicking 'Continue'.")
                .settings.css("font-size", "20px")
                ,
                newText("comp1_3", "<p><b>Please answer honestly!</p><p>")
                .settings.center()
                .settings.css("font-size", "20px")
                ,
                newCanvas("compCanv", 900, 300)
                .settings.add(0,0, getText("comp1_1"))
                .settings.add(0,100, getText("comp1_2")  )
                .settings.add(355,225, getText("comp1_3")  )
                .print()   
                ,
                newButton("compStart", "Continue to the final task")
                .settings.center()
                .print()
                .wait()
               )
    
    .setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);

//====================================================================================================================================================================================================================
// 8. Comprehension test proper // 26.05.2020 PM added and changed numbering

var names = [];
var test;
function handleNames(row){
    if (row.name=="void"){
        names = names.sort(v=>1-2*(Math.random()>=0.5));
        return newTrial("post-task",
                        
                        newText("instructions", "<p>Please indicate whether you're <b>familiar with the following cultural figures </b>('yes' or 'no'). <p>You must make a selection for each cultural figure before continuing.")
                        //.settings.center()
                        .settings.css("font-size", "20px")
                        ,
                        newCanvas("screen", 1500, 450)
                        .add(350, 100, getText("instructions")) // leftmost ja/nein
                        .add(285, 245, newText("yes / no")) // leftmost ja/nein
                        .add(650 , 245, newText("yes / no")) // center ja/nein
                        .add(990, 245, newText("yes / no")) // rightmost ja/nein
                        // names
                        .add(250, 170 , newCanvas("names-1", "60%", "100%") ) // leftmost column
                        .add( 620, 170, newCanvas("names-2", "60%", "100%") ) // center column
                        .add( 960, 170 , newCanvas("names-3", "60%", "100%") ) // rightmost column
                        .print( "font-size", "20px")
                        ,
                        ...names.map( (r,i) => {
                            test = test || newFunction(v=>true).test.is(true);
                            test = test.and( getScale(r.name+'-scale-'+', life ='+r.life+'list ='+r.which_list).test.selected() );
                            return newText(r.name)
                            .before(
                            newScale(r.name+'-scale-'+', life ='+r.life+'list ='+r.which_list, "yes", "no") //global_z.css is needed to hide the lables "yes" & "no"
                            .log()
                            .print()
                            )
                            .print( "2em" , parseInt(6+(i%17)*2)+"em" , getCanvas("names-"+parseInt(1+i/17)) );
                        })
                            ,                          
                            newButton("continueb", "Continue")
                            .print(640, 870)
                            .wait(test)       //  would only proceed if all Scale elements are selected       
                            )                           
                            
                        }
                            names.push(row);
                            return [];
                        }
                            Template( "post-task.csv", row => handleNames(row) );
                            
                            // --------------------------------------------------------------------------------------------------------------
                            // 3. Send results
                            
                            PennController.SendResults( "send" ); // important!!! Sends all results to the server
                            
                            
                            // --------------------------------------------------------------------------------------------------------------
                            // 4. Thank you screen
                            
                            PennController( "final" ,
                            newText("<p>Thank you for your participation!</p>")
                            .print()
                            ,
                            newText("<p><a href='https://app.prolific.co/submissions/complete?cc=84307B55'>Click here to validate your participation.</a></p>") // confirmation link (e.g., for payment)
                            .print()
                            ,
                            newButton("void") // this creates a 'void' button that must be clicked to continue. This is because we don't want them to be able to continue beyond this screen
                            .wait() // so basically this is the end and there's no way to go any further
                            );
