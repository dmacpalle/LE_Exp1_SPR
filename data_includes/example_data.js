PennController.ResetPrefix(null);

// PennController.DebugOff() // use for the final version

// --------------------------------------------------------------------------------------------------------------
// Preamble

// sequence
//PennController.Sequence( "welcome-consent", "demographics", "instructions1", "practice", "instructions2", shuffle(randomize("critical"), randomize("filler")), "send", "final");
PennController.Sequence( "practice", "instructions2", shuffle(randomize("critical"), randomize("filler")), "send", "final");

// create dashed function
dashed = (sentence, remove) => {
    let words = sentence.split('*'),  blanks = words.map(w=>w.split('').map(c=>'_').join('') );
    let textName = 'dashed'+words.join('');
    // We'll return cmds: the first command consists in creating (and printing) a Text element with dashes
    let cmds = [ newText(textName, blanks.join(' ')).print() .settings.css("font-family","courier")]; // COURIER as font
    // We'll go through each word, and add two command blocks per word
    for (let i = 0; i <= words.length; i++)
    cmds = cmds.concat([ newKey('dashed'+i+words[i], " ").log().wait() , // Wait for (and log) a press on Space
    getText(textName).text(blanks.map((w,n)=>(n==i?words[n]:w)).join(' ')) ]); // Show word
    if (remove)  // Remove the text after the last key.wait() is parameter specified
    cmds.push(getText(textName).remove());
    return cmds;
};

/* 
create cumulative function
cumulative = (sentence, remove) => {
    let words = sentence.split('*')
    ,  
    blanks = words.map(w=>w.split('').map(c=>'_').join('') );
    let textName = 'dashed'+words.join('');
    // We'll return cmds: the first command consists in creating (and printing) a Text element with dashes
    let cmds = [ newText(textName, blanks.join(' ')).print() .settings.css("font-family","courier")]; // COURIER as font
    // We'll go through each word, and add two command blocks per word
    for (let i = 0; i <= words.length; --i)
    cmds = cmds.concat([ newKey('dashed'+i+words[i], " ").log().wait() // Wait for (and log) a press on Space
    , 
    getText(textName)
    .text(blanks.map((w,n)=>(n==i?words[n]:w)).join(' ')) // Show word
    ]); 
    if (remove)  // Remove the text after the last key.wait() is parameter specified
    cmds.push(getText(textName).remove());
    return cmds;
};
*/



// --------------------------------------------------------------------------------------------------------------
// Consent form / Welcome
PennController( "welcome-consent" ,
                newHtml("instructions", "welcome-consent.html")
                .print()
                ,
                newButton("consent button", "Continue")
                .print()
                .wait()
               );

// --------------------------------------------------------------------------------------------------------------
// Demographics

PennController("demographics",
               defaultText
               .settings.css("font-family","times new roman")
               ,
               newTextInput("ID") // collect participant ID using a 'text input field'
               .settings.before(newText("pxRequest", "Please enter your participant ID:  ")
                                .settings.italic())
               .print() // BUT won't collect the value of their input
               ,
               newText("<p>Click the button below to start the experiment.</p>")
               ,
               newButton("Continue") // a button with the word 'start'; DP
               .print()
               .wait() // wait until button is clicked; DP
               ,
               newVar("ID") // this will create a new variable "ID"; MUST be after the 'Start' button click
               .settings.global() // ensures value of "ID" is available later to be added to results file
               .set( getTextInput("ID") ) // setting the value of "ID" to be the input from "ID above"
              )
    .log( "ID" , getVar("ID") 
         );

// --------------------------------------------------------------------------------------------------------------
// Instructions
PennController("instructions1",
               newHtml("instructions", "instructions1.html")
               .print()
               ,
               newButton("consent button", "Continue")
               .print()
               .wait()
              );

// --------------------------------------------------------------------------------------------------------------
// Practice items


PennController.Template(PennController.GetTable("fictional-practice.csv"),
                        variable => ["practice",
                                     "PennController", PennController(
                                         defaultText
                                         .settings.css("font-family","courier")
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
                                     //...dashed(variable.critical, "remove")
                                     ,
                                     /*newText("scale_title", "How natural did you find this sentence?")
                                     .settings.css("font-family","times new roman")
                                     .settings.center()
                                     .print()
                                     ,*/
                                     newScale("rating", 7)
                                     .settings.before( newText("left", "definitely wrong") .settings.css("font-family","times new roman"))
                                     .settings.after( newText("right", "perfectly fine") .settings.css("font-family","times new roman"))
                                     .print()
                                     .wait()
                                     ,
                                     newButton("finish", "submit") 
                                     .settings.center()
                                     .print()
                                     .wait()
                                     ,   
                                     getButton("finish")
                                     .remove()  
                                     ,      
                                     getScale("rating")
                                     .remove() 
                                     /*,      
                                     getText("scale_title")
                                     .remove() */
                                     ,         
                                     newText("pleasewait2", "Please wait for the next biography.")
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
                                     .log("ID" , getVar("ID"))
                                     .log("type", variable.type)
                                     .log("lifetime" , variable.vital_status)
                                     .log("tense", variable.tense)
                                     .log("rating", getVar("rating"))
                                     .log("item" , variable.item_id) 
                                     .log("name" , variable.name)  
                                     .log("list", variable.list)
                                    ]
                       );
// --------------------------------------------------------------------------------------------------------------
// Instructions
PennController("instructions2",
               newHtml("instructions", "instructions2.html")
               .print()
               ,
               newButton("consent button", "Continue")
               .print()
               .wait()
              );

// --------------------------------------------------------------------------------------------------------------
// Critical items

PennController.Template( PennController.GetTable("fictional.csv"), // use subset.csv for celebrity names
                         variable => ["critical",
                                      "PennController", PennController(
                                          defaultText
                                          .settings.css("font-family","courier")
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
                                      /*newText("scale_title", "How natural did you find this sentence?")
                                      .settings.css("font-family","times new roman")
                                      .settings.center()
                                      .print()
                                      ,*/
                                      newScale("rating", 7)
                                      .settings.before( newText("left", "definitely wrong") .settings.css("font-family","times new roman"))
                                      .settings.after( newText("right", "perfectly fine") .settings.css("font-family","times new roman"))
                                      .print()
                                      .wait()
                                      ,
                                      newButton("finish", "submit") 
                                      .settings.center()
                                      .print()
                                      .wait()
                                      ,   
                                      getButton("finish")
                                      .remove()  
                                      ,      
                                      getScale("rating")
                                      .remove() 
                                      /*,      
                                      getText("scale_title")
                                      .remove() */
                                      ,         
                                      newText("pleasewait2", "Please wait for the next biography.")  
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
                                      .log("ID" , getVar("ID"))
                                      .log("type", variable.type)
                                      .log("lifetime" , variable.vital_status)
                                      .log("tense", variable.tense)
                                      .log("rating", getVar("rating"))
                                      .log("item" , variable.item_id) 
                                      .log("name" , variable.name)  
                                      .log("list", variable.list)
                                     ]
                        );

// --------------------------------------------------------------------------------------------------------------
// Filler items

PennController.Template( PennController.GetTable("fillers.csv"),
                         variable => ["filler",
                                      "PennController", PennController(
                                          defaultText
                                          .settings.css("font-family","courier")
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
                                      .print()
                                      .wait()
                                      ,
                                      newButton("finish", "submit") 
                                      .settings.center()
                                      .print()
                                      .wait()
                                      ,   
                                      getButton("finish")
                                      .remove()  
                                      ,      
                                      getScale("rating")
                                      .remove() 
                                      /*,      
                                      getText("scale_title")
                                      .remove() */
                                      ,         
                                      newText("pleasewait2", "Please wait for the next biography.")
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
                                      .log("ID" , getVar("ID"))
                                      .log("type", variable.type)
                                      .log("lifetime" , variable.vital_status)
                                      .log("tense", variable.tense)
                                      .log("rating", getVar("rating"))
                                      .log("item" , variable.item_id) 
                                      .log("name" , variable.name)  
                                      .log("list", variable.list)
                                     ]
                        );

// --------------------------------------------------------------------------------------------------------------
// 3. Send results

PennController.SendResults( "send" ); // important!!! Sends all results to the server


// --------------------------------------------------------------------------------------------------------------
// 4. Thank you screen

PennController( "final" ,
                newText("<p>Thank you for your participation!</p>")
                .print()
                ,
                newText("<p><a href='https://www.put.your/platform/confirmation/link.here'>Click here to validate your participation.</a></p>") // confirmation link (e.g., for payment)
                .print()
                ,
                newButton("void") // this creates a 'void' button that must be clicked to continue. This is because we don't want them to be able to continue beyond this screen
                .wait() // so basically this is the end and there's no way to go any further
               );
