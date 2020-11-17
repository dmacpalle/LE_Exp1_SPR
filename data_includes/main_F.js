PennController.ResetPrefix(null);
//PennController.DebugOff() // use for the final version

// --------------------------------------------------------------------------------------------------------------
// Preamble

// sequence
// partial test run:
//PennController.Sequence("practice");
//PennController.Sequence(subsequence(repeat(shuffle(randomize("critical")), 10) , "break"), "final");
// full sequence test run (8 items):
PennController.Sequence( "demographics", "instructions1", "practice", "instructions2", subsequence(repeat(shuffle(randomize("critical"), randomize("filler")), 4) , "break"), "post-instructions", "post-ques", "post-task-intro", "post-task",  "send", "final");

// FOR REAL PARTICIPANTS; check: # of trials, DebugOff, DELETE results file
//PennController.DebugOff()
//PennController.Sequence( "demographics", "instructions1", "practice", "instructions2", subsequence(repeat(shuffle(randomize("critical"), randomize("filler")), 25) , "break"), "post-instructions", "post-ques", "post-task-intro", "post-task",  "send", "final");



// create dashed function
dashed = (sentence, remove) => {
    let words = sentence.split('*'),  blanks = words.map(w=>w.split('').map(c=>'_').join('') ); // 'sentence.spilot('*')' = '*' defines the chunk boundaries (in the .csv)
    let textName = 'dashed'+words.join('');
    // We'll return cmds: the first command consists in creating (and printing) a Text element with dashes
    let cmds = [ newText(textName, blanks.join(' ')).print() 
    .settings.css("font-family","courier") 
    .settings.css("font-size", "20px")
  //.settings.css("font-size", "2em")  
    .settings.center() 
    .cssContainer({
    "width": "90vw"})
    ]; // COURIER as font
    // We'll go through each word, and add two command blocks per word
    for (let i = 0; i <= words.length; i++)
    cmds = cmds.concat([ newKey('dashed'+i+words[i], " ").log().wait() , // Wait for (and log) a press on Space
    getText(textName).text(blanks.map((w,n)=>(n==i?words[n]:w)).join(' ')) ]); // Show word
    if (remove)  // Remove the text after the last key.wait() is parameter specified
    cmds.push(getText(textName).remove());
    return cmds;
};

// create cumulative function
cumulative_bio = (sentence, remove) => {
    let words = sentence.split('*'),  blanks = words.map(w=>w.split('').map(c=>'_').join('') ); // 'sentence.split('*')' = '*' defines the chunk boundaries (in the .csv)
    let textName = 'cumulative'+words.join('');
    // We'll return cmds: the first command consists in creating (and printing) a Text element with dashes
    let cmds = [ newText(textName, blanks.join(' '))
    //.print()
    .settings.css("font-family","courier")
    .settings.css("font-size", "20px")
    .print("20vw","40vh")
    //.settings.css("font-size", "0.5em")  
    // .cssContainer({"width": "90vw"})
    ];
    // COURIER as font
    // We'll go through each word, and add two command blocks per word
    for (let i = 0; i <= words.length; i++)
    cmds = cmds.concat([ newKey('cumulative'+i+words[i], " ").log().wait() , // Wait for (and log) a press on Space
    getText(textName).text(blanks.map((w,n)=>(n<=i?words[n]:w)).join(' ')) ]); // Show word
    if (remove)  // Remove the text after the last key.wait() is parameter specified
    cmds.push(getText(textName).remove()); 
    return cmds;
};

// create cumulative function
cumulative = (sentence, remove) => {
    let words = sentence.split('*'),  blanks = words.map(w=>w.split('').map(c=>'_').join('') ); // 'sentence.split('*')' = '*' defines the chunk boundaries (in the .csv)
    let textName = 'cumulative'+words.join('');
    // We'll return cmds: the first command consists in creating (and printing) a Text element with dashes
    let cmds = [ newText(textName, blanks.join(' ')).print() .settings.css("font-family","courier") .settings.css("font-size", "20px") .print("20vw","50vh")]; // COURIER as font
    // We'll go through each word, and add two command blocks per word
    for (let i = 0; i <= words.length; i++)
    cmds = cmds.concat([ newKey('cumulative'+i+words[i], " ").log().wait() , // Wait for (and log) a press on Space
    getText(textName).text(blanks.map((w,n)=>(n<=i?words[n]:w)).join(' ')) ]); // Show word
    if (remove)  // Remove the text after the last key.wait() is parameter specified
    cmds.push(getText(textName).remove()); 
    return cmds;
};

// create cumulative function
cumulative_crit = (sentence, remove) => {
    let words = sentence.split('*'),  blanks = words.map(w=>w.split('').map(c=>'_').join('') ); // 'sentence.split('*')' = '*' defines the chunk boundaries (in the .csv)
    let textName = 'cumulative'+words.join('');
    // We'll return cmds: the first command consists in creating (and printing) a Text element with dashes
    let cmds = [ newText(textName, blanks.join(' ')).print() .settings.css("font-family","courier") .settings.css("font-size", "20px") .print("20vw","50vh")]; // COURIER as font
    // We'll go through each word, and add two command blocks per word
    for (let i = 0; i <= words.length; i++)
    cmds = cmds.concat([ newKey('cumulative'+i+words[i], " ").log().wait() , // Wait for (and log) a press on Space
    getText(textName).text(blanks.map((w,n)=>(n<=i?words[n]:w)).join(' ')) ]); // Show word
    if (remove)  // Remove the text after the last key.wait() is parameter specified
    cmds.push(getText(textName).remove()); 
    return cmds;
};

//====================================================================================================================================================================================================================
// 1. Welcome page/demographics

PennController("demographics",
               // ENTER PROLIFIC ID
               newText("welcometext", "<p><b>Welcome to our experiment!</b><p>")
               .settings.css("font-size", "30px")
               ,
               newCanvas("welcomecanvas", 1000, 125)
               .settings.add("center at 50%", 0, getText("welcometext") )
               .print()
               ,
               newTextInput("proID", "")
               .before(newText("proID", "Before we begin, please enter your Prolific ID: ") 
                       .settings.css("font-size", "20px"))
               .size(100, 20)
               .settings.center()
               .print()
               ,
               newText("blank","<p>")
               .print()
               ,
               newButton("start", "Continue")
               .settings.center() 
               .print() 
               .wait(getTextInput("proID")
                     .test.text(/[^\s]+/)
                     .success()
                     .failure(
                         newText("IDerror","Please enter your Prolific ID in order to continue.")
                         .settings.color("red")
                         .settings.center()
                         .print()
                     )  
                    )
               ,   
               getCanvas("welcomecanvas")
               .remove()
               ,
               getTextInput("proID")
               .remove()
               ,
               getButton("start")
               .remove()
               ,
               getText("IDerror")
               .remove()
               ,
               // ENTER DEMOGRAPHICS
               newText("demo", "<p>Before you continue to the instructions, we need to know a few things about you."
                       +" This information will remain anonymous. You can read more about how we handle your data in our Information Sheet below.<p>")              
               .settings.css("font-size", "20px")
               ,
               newCanvas("democanvas", 1000, 125)
               .settings.add(0, 0, getText("demo") )
               .print()
               ,
               newDropDown("age", "")
               .settings.add( "17 or younger" , "18" , "19" , "20", "21" , "22" , "23", "24" , "25" , "26", "27" , "28" , "29", "30" , "31" , "32 or older" )
               ,
               newText("agetext", "Age:")
               .settings.css("font-size", "20px")
               .settings.bold()
               //.settings.after( getDropDown("age") )    
               ,
               newCanvas("agecanvas", 1000, 45)
               .settings.add(0, 10, getText("agetext") )
               .settings.add(100, 8, getDropDown("age") )
               .print()    
               ,
               newText("sex", "Gender:")
               .settings.css("font-size", "20px")
               .settings.bold()
               ,
               newDropDown("sex", "" )
               .settings.add( "female", "male", "other")
               ,
               newCanvas("sexcanvas", 1000, 40)
               .settings.add(0, 0, getText("sex") )
               .settings.add(120, 3, getDropDown("sex") )
               .print()
               ,
               newText("nativeEng", "<b>Were you raised monolingually in English?</b><br>(i.e., in English and only English?)")
               .settings.css("font-size", "20px")
               ,
               newTextInput("L2", "")
               .settings.hidden()
               ,
               newText("label input", "")
               .settings.after( getTextInput("L2") )
               ,
               newDropDown("language", "")
               .settings.log()
               .settings.add(  "yes", "no, I was (also) raised in:")    
               .settings.after(  getText("label input") )
               .settings.callback(                                             //whenever an option is selected, do this:
                   getDropDown("language")
                   .test.selected("no, I was (also) raised in:")                             //reveal the input box
                   .success( getTextInput("L2").settings.visible() )     //hide the input box
                   .failure( getTextInput("L2").settings.hidden()  )   
               )        
               ,
               newCanvas("languagecanvas", 1000, 25)
               .settings.add(0, 0, getText("nativeEng") )
               .settings.add(400, 2, getDropDown("language") )
               .print()
               ,
               newText("<p> ")
               .print()
               ,    
               newText("information", "<p>Before continuing the experiment, please read our"
                       +" <a href='https://amor.cms.hu-berlin.de/~pallesid/LE_Exp1_spr/LE1_SPR_info_sheet_final.pdf' target='_blank' >Participant's Information Sheet</a> and"
                       +" <a href='https://amor.cms.hu-berlin.de/~pallesid/LE_Exp1_spr/LE1_SPR_consentAgreement_final.pdf' target='_blank'>Consent Form</a>.<p>")    
               .settings.css("font-size", "20px")
               ,
               newCanvas("infocanvastwo", 1000, 80)
               .settings.add(0, 0, getText("information") )
               .print()
               ,
               newText("browser_info", "<p>Please note that this experiment should only be run on <b>Mozilla Firefox</b> or <b>Google Chrome</b> and should <i>not</i> be run on a mobile phone.<p>")
               .settings.css("font-size", "20px")
               ,
               newCanvas("infocanvasthree", 1000, 115)
               .settings.add(0, 0, getText("browser_info") )
               .print()
               ,
               newText("consent", "By ticking the button below, I declare I have fully read and <br>understood the Participant's Information Sheet and Consent Form.<p>")
               .settings.css("font-size", "15px")  
               .settings.center()      
               .print()
               ,
               newButton("consent","Yes, I have read them.")
               .settings.center()
               .print()
               .wait()
               ,
               getDropDown("age")
               .test.selected()
               .success()
               .failure(
                   newText("ageerror","Please enter your age.")
                   .settings.color("red")
                   .print())   
               ,
               getDropDown("sex")
               .test.selected()
               .success()
               .failure(
                   newText("sexerror","Please ender your gender.")
                   .settings.color("red")
                   .print())
               ,
               getDropDown("language")
               .test.selected()
               .success()
               .failure(
                   newText("langerror","Please answer the question about your language history.")                   
                   .settings.color("red")
                   .print())      
               ,
               getDropDown("age").wait("first")
               ,
               getDropDown("sex").wait("first")
               ,
               getDropDown("language").wait("first")
               ,
               newButton("continue", "Continue to experiment")
               .settings.center()
               .print()
               .wait()
               
               ,
               getButton("consent")
               .remove()
               ,
               getButton("continue")
               .remove()
               ,
               getText("consent")
               .remove()
               ,
               getCanvas("infocanvastwo")
               .remove()
               ,
               newText("<p> ")
               .print()  
               ,
               // Create new variables from input
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
               newVar("whichL2")
               .settings.global()
               .set( getTextInput("L2") )
               ,
               newVar("proID")
               .settings.global()
               .set( getTextInput("proID") )
               ,
               // set 'yes' and 'no' keys
               newVar("yes_key")
               .settings.global()
               .set( "F" ) // for F-version
               // .set( "J" ) // for J-version
               ,
               // set 'no' key; this is necessary for the conditional in the practice round (for feedback)
               newVar("no_key")
               .settings.global()
               .set( "J" ) // for F-version
               // .set( "F" ) // for J-version
              )                                 //end of welcome screen
    
    
    .log("prolificID", getVar("proID"))
    .log("age", getVar("IDage"))
    .log("sex", getVar("IDsex"))
    .log("L2", getVar("IDling"))
    .log("whichL2", getVar("whichL2")) 
    .log("type", "demo")
    .log("lifetime" , "demo")
    .log("tense", "demo")
    .log("mm", "demo")
    .log("match", "demo")
    .log("rating", "demo")
    .log("item" , "demo") 
    .log("name" , "demo")  
    .log("list", "demo")
    .log( "withsquare", PennController.GetURLParameter("withsquare"))    
    .log("bare_verb", "demo")
    .log( "yes_key" , getVar("yes_key"))
    
    .setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);

//====================================================================================================================================================================================================================
// 2. Cancel

//====================================================================================================================================================================================================================
// 2. Intro/instructions

PennController( "instructions1",
                
                getVar("IDage")
                .testNot.is("17 or younger")   // if particpant is NOT under 17
                .and( getVar("IDage")
                      .testNot.is("32 or older")   // AND if particpant is NOT over 32
                     )
                .and(getVar("IDling") 
                     .testNot.is("no, I was (also) raised in:")    // AND participant is NOT bi-lingual
                    )
                .success()   // continue as normal
                .failure(    // otherwise, send results and end prematurely
                    SendResults()  // for this to work within a PC, I changed the PC.js file (Edit your file PennController.js and replace occurrences of e=window.items.indexOf(n); (there should be 2) with e=window.items&&window.items.indexOf(n);)
                    ,
                    newText("bye", "<p>You are ineligible for this study, as you have provided information which is inconsistent with your Prolific prescreening responses. "
                            + "<p>Please return your submission on Prolific by selecting the 'Stop without completing' button."
                           ) 
                    .settings.css("font-size", "20px")
                    .settings.color("red") 
                    .settings.bold()
                    .print() 
                    ,
                    newText("bye2", "<p><b>Why was I excluded?</b><p>We used Prolific's prescreening options in order to recruit participants who are "
                            + "between the <b>ages of 18-31</b>, whose first/<b>native language is English</b>,<br> and who <b>grew up speaking only "
                            + "their native language</b> (which in this case should be English).<p> You must have indicated on the previous "
                            + "page that one of these is not true. If you think there has been a mistake, please let the researchers know via Prolific. <br>We have saved "
                            + "your responses and will gladly check them and pay you if there has been an error!"
                           ) 
                    .print() 
                    .wait()
                )
                
                ,
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
                newText("set-up", "<p>Because <b>this is an experiment</b>, we would appreciate if you could take the following steps to ensure concentration:<p><t>&nbsp;&nbsp;&nbsp;&nbsp;&bull; <b>turn off any music</b>/audio you may be listening to<p>&nbsp;&nbsp;&nbsp;&nbsp;&bull; refrain from Googling or looking up information during the experiment<p><t>&nbsp;&nbsp;&nbsp;&nbsp;&bull; put your <b>phone on silent</b> and leave it face down or out of reach<p><t>&nbsp;&nbsp;&nbsp;&nbsp;&bull; attend to the experiment until it is over (there is a short break half way through)<p><t>&nbsp;&nbsp;&nbsp;&nbsp;&bull; in general behave as if you were in our laboratory!<p>These steps will help ensure the data we collect from you is high quality. Please <b>press the spacebar</b> if you agree to take these steps.")
                .settings.css("font-size", "20px")
                ,
                newCanvas("set-upcanvas",900, 450)
                .settings.add(0,0, getText("set-up"))
                .print()   
                ,
                newKey("set-up"," ")
                .wait()
                ,     
                getCanvas("set-upcanvas")
                .remove()
                ,
                newTimer("intro", 500)
                .start()
                .wait()
                ,              
                newText("instructions_a", "<b>Description of the experiment</b><p>"
                        + "In this experiment, you will be reading sentences about cultural figures."
                        + "<br>You may be very familiar with some cultural figures, and not very familiar with others."
                        + "<p>(1) <b>A short biography</b> of a cultural figure from around the world will appear, chunk-by-chunk. "
                        + "<p>Once you have read each chunk, press the <b>spacebar</b> to reveal the next chunk. "
                        + "Once you reach the end of the sentence, hit the spacebar again."
                        + " Please avoid repeatedly hitting the spacebar in order to read the sentence as a whole."
                        + "<p><b>Try to only hit the spacebar once you have fully read the new chunk</b>. "
                       )
                .settings.css("font-size", "20px")
                ,
                newText("bio_example1", "e.g, <i>'Sir David Attenborough __ __________ ____________ ________ __________'</i>")
                .settings.css("font-size", "15px")
                .settings.css("font-family","courier")
                ,
                newText("bio_example2", "e.g, <i>'Sir David Attenborough is __________ ____________ ________ __________'</i>")
                .settings.css("font-size", "15px")
                .settings.css("font-family","courier")
                ,
                newText("bio_example3", "e.g, <i>'Sir David Attenborough is an English ____________ ________ __________'</i>")
                .settings.css("font-size", "15px")
                .settings.css("font-family","courier")
                ,
                newText("bio_example4", "e.g, <i>'Sir David Attenborough is an English broadcaster. ________ __________'</i>")
                .settings.css("font-size", "15px")
                .settings.css("font-family","courier")
                ,              
                newText("bio_example5", "e.g, <i>'Sir David Attenborough is an English broadcaster. He lives __________'</i>")
                .settings.css("font-size", "15px")
                .settings.css("font-family","courier")
                ,
                newText("bio_example6", "e.g, <i>'Sir David Attenborough is an English broadcaster. He lives in London.'</i>")
                .settings.css("font-size", "15px")
                .settings.css("font-family","courier")
                ,
                
                newCanvas("instruccanvas",900, 450)
                .settings.add(0,0, getText("instructions_a"))
                .settings.add(30,280, getText("bio_example1"))
                .print()   
                ,
                newKey("con1"," ")
                .wait()
                ,
                getCanvas("instruccanvas")
                .remove(getText("bio_example1"))
                .settings.add(30,280, getText("bio_example2"))
                ,
                newKey("con2"," ")
                .wait()
                ,
                getCanvas("instruccanvas")
                .remove(getText("bio_example2"))
                .settings.add(30,280, getText("bio_example3"))
                
                ,
                newKey("con3"," ")
                .wait()
                ,
                getCanvas("instruccanvas")
                .remove(getText("bio_example3"))
                .settings.add(30,280, getText("bio_example4"))
                ,
                newKey("con4"," ")
                .wait()
                ,
                getCanvas("instruccanvas")
                .remove(getText("bio_example4"))
                .settings.add(30,280, getText("bio_example5"))
                ,
                newKey("con5"," ")
                .wait()
                ,
                getCanvas("instruccanvas")
                .remove(getText("bio_example5"))
                .settings.add(30,280, getText("bio_example6"))
                ,
                newKey("instr_a", " ")
                .wait()
                ,
                getCanvas("instruccanvas")
                .remove(getText("instructions_a"))
                ,
                newText("instructions_b", "<p>(2) You will then be presented with a <b>new sentence revealed chunk-by-chunk.</b> "
                        + "Again, hit the <b>spacebar</b> to reveal the next sentence chunk.<br>"
                       )
                .settings.css("font-size", "20px")
                ,
                newText("example", "<p><i>'He ____________ ____ ____________________ ___________'</i>")
                .settings.css("font-size", "15px")
                .settings.css("font-family","courier")
                ,
                newText("example1", "<p><i>'He has narrated ____ _____________________ ___________'</i>")
                .settings.css("font-size", "15px")
                .settings.css("font-family","courier")
                ,
                newText("example2", "<p><i>'He has narrated many _____________________ ___________'</i>")
                .settings.css("font-size", "15px")
                .settings.css("font-family","courier")
                ,
                newText("example3", "<p><i>'He has narrated many nature documentaries, ___________'</i>")
                .settings.css("font-size", "15px")
                .settings.css("font-family","courier")
                ,
                newText("example4", "<p><i>'He has narrated many nature documentaries, apparently.'</i>")
                .settings.css("font-size", "15px")
                .settings.css("font-family","courier")
                , 
                getCanvas("instruccanvas")
                .settings.add(0,0, getText("instructions_b"))
                .settings.add(70,300, getText("example"))
                .print()  
                ,
                newKey("ex1"," ")
                .wait()
                ,
                getCanvas("instruccanvas")
                .remove(getText("example"))
                .settings.add(70,300, getText("example2"))
                ,
                newKey("ex2"," ")
                .wait()
                ,
                getCanvas("instruccanvas")
                .remove(getText("example2"))
                
                .settings.add(70,300, getText("example3"))
                .print()  
                ,                
                newKey("ex3"," ")
                .wait()
                ,
                getCanvas("instruccanvas")
                .remove(getText("example3"))
                .settings.add(70,300, getText("example4"))
                .print()  
                , 
                newKey("instr_c", " ")
                .wait()
                ,
                getCanvas("instruccanvas")
                .remove(getText("instructions_b"))
                ,
                newText("instructions_c", "<p>(3) After this sentence, you will decide whether the last sentence fits "
                        + "naturally with the previous mini-biography by pressing"
                        + " the <b>'F' key</b> for <i>'yes, it fits'</i>, or the <b>'J' key</b> for <i>'no, it doesn't'</i>." // F-version
                        // + "the 'F' key for 'no, it doesn't', or the 'J' key for 'yes, it fits'." // J-version
                        + " However, during the experiment the sentences will disappear before you can make a selection, so consider this when you reach the end of the sentences."
                        + "<p>Once you've made your decision, you will continue to the next cultural figure."
                        + "<br> You only have a few seconds to make this selection, otherwise it will time out."
                        + "<p>You’ll now start a practice round with instructions in red to help you. When you’re ready to start, press the <b>spacebar</b>. <p>")
                .settings.css("font-size", "20px")
                ,
                getCanvas("instruccanvas")
                .settings.add(0,0, getText("instructions_c"))
                .print()  
                , 
                newKey("instr_a", " ")
                .wait()
                ,
                newKey("prac_start"," ")
                .wait()
               )
    .log("prolificID", getVar("proID"))
    .log("age", getVar("IDage"))
    .log("sex", getVar("IDsex"))
    .log("L2", getVar("IDling"))
    .log("whichL2", getVar("whichL2")) 
    .log("type", "instr")
    .log("lifetime" , "instr")
    .log("tense", "instr")
    .log("mm", "instr")  
    .log("match", "instr")
    .log("rating", "instr")
    .log("item" , "instr") 
    .log("name" , "instr")  
    .log("list", "instr")
    .log( "withsquare", PennController.GetURLParameter("withsquare"))    
    .log("bare_verb", "instr")
    .log( "yes_key" , getVar("yes_key"))
    
    .setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);

//====================================================================================================================================================================================================================
// Practice items


PennController.Template( PennController.GetTable( "master_spr_all.csv")// change this line for the appropriate experimental list
                         .filter("type" , "practice")
                         ,  
                         variable => ["practice",
                                      "PennController", PennController(
                                          defaultText
                                          .settings.css("font-family","courier")
                                          ,
                                          // set 'yes' and 'no' keys; can be put in 'Welcome' screen and deleted
                                          /*newVar("yes_key")
                                          .settings.global()
                                          .set( "F" )
                                          ,
                                          newVar("no_key")
                                          .settings.global()
                                          .set( "J" )
                                          , */
                                          // set trial's correct response; must remain here
                                          newVar("match")
                                          .set(variable.match)
                                          ,
                                          // dots
                                          newText("dots", "...")
                                          .print("20vw","40vh")
                                          ,
                                          newTimer("dots", 1000)
                                          .start()
                                          .wait()
                                          ,
                                          getText("dots")
                                          .remove()
                                          ,
                                          // context sentence
                                          newText ("bio_instru","<i>Read the short biography and <b>press spacebar</b> to continue</i>")
                                          .settings.css("font-size", "15px")
                                          .settings.center()
                                          .settings.css("font-family","times new roman")
                                          .settings.color("red")
                                          .print("20vw","35vh")
                                          ,
                                          getText("dots")
                                          .remove()
                                          ,
                                          // context sentence
                                          ...cumulative_bio(variable.bio_spr, "remove")  
                                      ,
                                      getText("bio_instru")
                                      .remove()
                                      ,
                                      newText("bio", variable.bio)
                                      .print()
                                      .settings.css("font-size", "20px")
                                      .settings.css("font-family","courier")
                                      .print("20vw","40vh")
                                      ,
                                      newText ("crit_instru","<i><b>Press the spacebar</b> to reveal the next chunk.</i>")
                                      .settings.css("font-size", "15px")
                                      .settings.center()
                                      .settings.css("font-family","times new roman")
                                      .settings.color("red")
                                      .print("20vw","55vh")
                                      ,
                                      //critical sentence
                                      ...cumulative(variable.critical, "remove")    
                                      ,
                                      // clear bio and crit sentences
                                      getText("crit_instru")
                                      .remove()
                                      ,
                                      getText("bio") 
                                      .remove()         
                                      ,
                                      // present judgement task instructions
                                      newText ("rating_instru", "<i>Did the last sentence fit with the preceding sentences?<p>The 'F' key = 'yes', the 'J' key = 'no'.</i>") // F-version
                                      // newText ("rating_instru", "<i>Did the last sentence fit with the preceding sentences?<p>The 'J' key = 'yes', the 'F' key = 'no'.</i>") // J-version
                                      .settings.center()
                                      .settings.css("font-size", "15px")
                                      .settings.css("font-family","times new roman")
                                      .settings.color("red")
                                      .print("center at 50%","30vh")
                                      // judgement task
                                      , 
                                      newText("F_text", "F")
                                      .settings.css("font-size", "20px")
                                      .print("40vw","40vh")
                                      //.settings.color("green")
                                      ,
                                      newText("yes_text", "<i>(yes)")
                                      .settings.css("font-size", "20px")
                                      .print("38vw","45vh") // F-version
                                      //.print("58vw","45vh") // J-version
                                      .settings.color("green")
                                      ,
                                      newText("J_text", "J")
                                      .settings.css("font-size", "20px")
                                      .settings.center()
                                      .print("60vw","40vh")
                                      //.settings.color("red")
                                      ,
                                      newText("no_text", "<i>(no)")
                                      .settings.css("font-size", "20px")
                                      .settings.center()
                                      .print("58vw","45vh") // F-version
                                      //.print("38vw","45vh") // J-version
                                      .settings.color("red")
                                      ,
                                      newKey("rating", "FJ")
                                      .callback( getTimer("time_out1").stop() )
                                      .log("all")  
                                      ,
                                      newTimer("time_out1", 7000)
                                      .start()
                                      .log()
                                      .wait()
                                      ,     
                                      // clear everything
                                      getText("rating_instru")
                                      .remove()
                                      , 
                                      getText("F_text")
                                      .remove()
                                      ,   
                                      getText("J_text")
                                      .remove()
                                      , 
                                      getText("no_text")
                                      .remove()
                                      ,
                                      getText("yes_text")
                                      .remove()
                                      ,                                 
                                      getKey("rating")
                                      .disable()
                                      ,
                                      // create variable for rating response
                                      newVar("rating")
                                      .set(getKey("rating") )
                                     ,
                                      // check if timedout
                                      getKey("rating")
                                      .test.pressed()
                                      .failure(
                                      newText("time-out", "Oops! Try to be faster.")
                                      .settings.css("font-size", "20px")
                                      .settings.css("font-family","times new roman")
                                      .settings.color("red")
                                      .settings.center()
                                      .print("40vh")
                                      ,
                                      newText("spacebar", "Press the spacebar to continue.")
                                      .settings.css("font-size", "15px")
                                      .settings.css("font-family","times new roman")
                                      .settings.center()
                                      .settings.color("red")
                                      .print("55vh")
                                      ,
                                      newKey("time-out", " ")
                                      .wait()
                                      )
                                      .success(
                                      
                                      
                                      // test response and give feedback
                                      getVar("rating")
                                      .test.is( // check if the rating...
                                      getVar("yes_key")) // ...is the same as the 'yes' key
                                      .and(getVar("match") // and if the correct answer...
                                      .test.is("yes")) // is 'yes'
                                      .or( // conversely,
                                      getVar("rating") // check if the rating... 
                                      .test.is(
                                      getVar("no_key")) // ...equals 'no'
                                      .and(getVar("match") // and if the correct answer...
                                      .test.is("no"))) // is 'no'
                                      .success // if either of those is true, the answer was correct
                                      (      
                                      
                                      newText ("match_text", variable.prac_correct)  
                                      .settings.css("font-size", "20px")
                                      .settings.css("font-family","times new roman")
                                      .print("20vw","40vh")
                                      ,
                                      newText("spacebar", "Press the spacebar to continue.")
                                      .settings.css("font-size", "15px")
                                      .settings.italic()
                                      .settings.css("font-family","times new roman")
                                      .settings.center()
                                      .settings.color("red")
                                      .print("20vw","50vh")
                                      ,
                                      newKey("feedback1", " ")
                                      .wait()
                                      
                                      )
                                      .failure // otherwise, the answer was wrong
                                      (
                                      newText ("mismatch_text", variable.prac_incorrect)  
                                      .settings.css("font-size", "20px")
                                      .settings.css("font-family","times new roman")
                                      .settings.color("red")
                                      .print("20vw","40vh")
                                      ,
                                      newText("spacebar", "Press the spacebar to continue.")
                                      .settings.css("font-size", "15px")
                                      .settings.italic()
                                      .settings.css("font-family","times new roman")
                                      .settings.center()
                                      .settings.color("red")
                                      .print("20vw","50vh")
                                      ,
                                      newKey("feedback2", " ")
                                      .wait()
                                      
                                      ) )
                                      /*,
                                      newVar("rating") // this will create a new variable "ID"; MUST be after the 'Start' button click
                                      //.settings.global()
                                      .set(getKey("rating") ) */
                                      )
                                      
                                      .log("prolificID", getVar("proID"))
                                      .log("age", getVar("IDage"))
                                      .log("sex", getVar("IDsex"))
                                      .log("L2", getVar("IDling"))
                                      .log("whichL2", getVar("whichL2")) 
                                      .log("type", variable.type)
                                      .log("lifetime" , variable.life_status)
                                      .log("tense", variable.tense)
                                      .log("mm", variable.mm)
                                      .log("match", variable.match)
                                      .log("rating", getVar("rating"))
                                      .log("item" , variable.item_id) 
                                      .log("name" , variable.name)  
                                      .log("list", variable.list)
                                      .log( "withsquare", PennController.GetURLParameter("withsquare") )    
                                      .log("bare_verb", variable.bare)
                                      .log( "yes_key" , getVar("yes_key"))
                                      
                                     ]
                         
                        );
//====================================================================================================================================================================================================================
// 4. Post-practice Instructions
PennController( "instructions2" ,
                newCanvas("dots", 300, 100)
                .print()
                ,
                newText("intro_experiment", "<p>That's the end of the practice round. You can now start the actual experiment. <p> <p>The instructions and feedback that appeared during the practice round (e.g., <i>Press the spacebar to continue</i>) will no longer appear.<p> There will be a short break halfway through the experiment.<p><b><i>Please attend to the experiment until you are finished finished. If you take too long, we won't be able to use your data!</i></b>")
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
    .log("prolificID", getVar("proID"))    
    .log("age", getVar("IDage"))
    .log("sex", getVar("IDsex"))
    .log("L2", getVar("IDling"))
    .log("whichL2", getVar("whichL2")) 
    .log("type", "instr2")
    .log("lifetime" , "instr2")
    .log("tense", "instr2")
    .log("mm", "instr2")
    .log("match", "instr2")
    .log("rating", "instr2")
    .log("item" , "instr2") 
    .log("name" , "instr2")  
    .log("list", "instr2")
    .log( "withsquare", PennController.GetURLParameter("withsquare"))    
    .log("bare_verb", "instr2")
    .log( "yes_key" , getVar("yes_key"))
    
    .setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);

//====================================================================================================================================================================================================================
// Critical items

PennController.Template( PennController.GetTable( "master_spr_all.csv")
                         .filter("type" , "critical")
                         ,
                         variable => ["critical",
                                      "PennController", PennController(
                                          defaultText
                                          .settings.css("font-family","courier")
                                          ,
                                          
                                          // dots
                                          newText("dots", "...")
                                          .print("20vw","40vh")
                                          ,
                                          newTimer("dots", 1000)
                                          .start()
                                          .wait()
                                          ,
                                          getText("dots")
                                          .remove()
                                          ,
                                          // context sentence
                                          ...cumulative_bio(variable.bio_spr, "remove")  
                                      ,
                                      newText("bio", variable.bio)
                                      .print()
                                      .settings.css("font-size", "20px")
                                      .settings.css("font-family","courier")
                                      .print("20vw","40vh")
                                      /*,
                                      /*newTimer("bio", 1000)
                                      .start()
                                      .wait()
                                      ,
                                      newKey("biospace", " ")
                                      .wait() */
                                      ,
                                      //critical sentence
                                      ...cumulative_crit(variable.critical, "remove")    
                                      ,  
                                      getText("bio") 
                                      .remove() 
                                      ,     
                                      newText("F_text", "F")
                                      .settings.css("font-size", "20px")
                                      .print("40vw","40vh")
                                      //.settings.color("green")
                                      ,
                                      newText("yes_text", "<i>(yes)")
                                      .settings.css("font-size", "20px")
                                      .print("38vw","45vh") // F-version
                                      //.print("58vw","45vh") // J-version
                                      .settings.color("green")
                                      ,
                                      newText("J_text", "J")
                                      .settings.css("font-size", "20px")
                                      .settings.center()
                                      .print("60vw","40vh")
                                      //.settings.color("red")
                                      ,
                                      newText("no_text", "<i>(no)")
                                      .settings.css("font-size", "20px")
                                      .settings.center()
                                      .print("58vw","45vh") // F-version
                                      //.print("38vw","45vh") // J-version
                                      .settings.color("red")
                                      ,
                                      newKey("rating", "FJ")
                                      .callback( getTimer("time_out1").stop() )
                                      .log("all")  
                                      ,
                                      newTimer("time_out1", 7000)
                                      .start()
                                      .log()
                                      .wait()
                                      ,     
                                      getText("F_text")
                                      .remove()
                                      ,   
                                      getText("J_text")
                                      .remove()
                                      ,                                  
                                      getKey("rating")
                                      .disable()
                                      ,
                                      newVar("rating") // this will create a new variable "rating"
                                      //.settings.global()
                                      .set(getKey("rating") )
                                      )
                                      .log("prolificID", getVar("proID"))
                                      .log("age", getVar("IDage"))
                                      .log("sex", getVar("IDsex"))
                                      .log("L2", getVar("IDling"))
                                      .log("whichL2", getVar("whichL2")) 
                                      .log("type", variable.type)
                                      .log("lifetime" , variable.life_status)
                                      .log("tense", variable.tense)
                                      .log("mm", variable.mm)
                                      .log("match", variable.match)
                                      .log("rating", getVar("rating"))
                                      .log("item" , variable.item_id) 
                                      .log("name" , variable.name)  
                                      .log("list", variable.list)
                                      .log( "withsquare", PennController.GetURLParameter("withsquare") )    
                                      .log("bare_verb", variable.bare)  
                                      .log( "yes_key" , getVar("yes_key"))
                                      
                                      
                                     ]
                        );

//====================================================================================================================================================================================================================
// Filler items

PennController.Template( PennController.GetTable( "master_spr_all.csv")
                         .filter("type" , "filler")
                         ,
                         variable => ["filler",
                                      "PennController", PennController(
                                          defaultText
                                          .settings.css("font-family","courier")
                                          ,
                                                                                    // dots
                                          newText("dots", "...")
                                          .print("20vw","40vh")
                                          ,
                                          newTimer("dots", 1000)
                                          .start()
                                          .wait()
                                          ,
                                          getText("dots")
                                          .remove()
                                          ,
                                          ...cumulative_bio(variable.bio_spr, "remove")
                                      ,
                                      // context sentence
                                      newText("bio", variable.bio)
                                      .print()
                                      .settings.css("font-size", "20px")
                                      .settings.css("font-family","courier")
                                      .print("20vw","40vh")
                                      ,
                                      //critical sentence
                                      ...cumulative_crit(variable.critical, "remove")    
                                      ,  
                                      getText("bio") 
                                      .remove()   
                                      ,
                                      newText("F_text", "F")
                                      .settings.css("font-size", "20px")
                                      .print("40vw","40vh")
                                      //.settings.color("green")
                                      ,
                                      newText("yes_text", "<i>(yes)")
                                      .settings.css("font-size", "20px")
                                      .print("38vw","45vh") // F-version
                                      //.print("58vw","45vh") // J-version
                                      .settings.color("green")
                                      ,
                                      newText("J_text", "J")
                                      .settings.css("font-size", "20px")
                                      .settings.center()
                                      .print("60vw","40vh")
                                      //.settings.color("red")
                                      ,
                                      newText("no_text", "<i>(no)")
                                      .settings.css("font-size", "20px")
                                      .settings.center()
                                      .print("58vw","45vh") // F-version
                                      //.print("38vw","45vh") // J-version
                                      .settings.color("red")
                                      ,     
                                      newKey("rating", "FJ")
                                      .callback( getTimer("time_out1").stop() )
                                      .log("all")  
                                      ,
                                      newTimer("time_out1", 7000)
                                      .start()
                                      .log()
                                      .wait()
                                      ,     
                                      getText("F_text")
                                      .remove()
                                      ,   
                                      getText("J_text")
                                      .remove()
                                      ,                                  
                                      getKey("rating")
                                      .disable()
                                      ,
                                      newVar("rating")
                                      //.settings.global()
                                      .set(getKey("rating") )
                                      )
                                      .log("prolificID", getVar("proID")) 
                                      .log("age", getVar("IDage"))
                                      .log("sex", getVar("IDsex"))
                                      .log("L2", getVar("IDling"))
                                      .log("whichL2", getVar("whichL2")) 
                                      .log("type", variable.type)
                                      .log("lifetime" , variable.life_status)
                                      .log("tense", variable.tense)
                                      .log("mm", variable.mm)
                                      .log("match", variable.match)
                                      .log("rating", getVar("rating"))
                                      .log("item" , variable.item_id) 
                                      .log("name" , variable.name)  
                                      .log("list", variable.list)
                                      .log( "withsquare", PennController.GetURLParameter("withsquare") )    
                                      .log("bare_verb", variable.bare)   
                                      .log( "yes_key" , getVar("yes_key"))
                                     ]
                        );

//====================================================================================================================================================================================================================
// 6. Break

PennController( "break" ,
                newCanvas("dots", 300, 100)
                .print()
                ,
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
    .log("prolificID", getVar("proID"))   
    .log("age", getVar("IDage"))
    .log("sex", getVar("IDsex"))
    .log("L2", getVar("IDling"))
    .log("whichL2", getVar("whichL2")) 
    .log("type", "break")
    .log("lifetime" , "break")
    .log("tense", "break")
    .log("mm", "break")
    .log("match", "break")
    .log("rating", "break")
    .log("item" , "break") 
    .log("name" , "break")  
    .log("list", "break")
    .log( "withsquare", PennController.GetURLParameter("withsquare"))    
    .log("bare_verb", "break")
    .log( "yes_key" , getVar("yes_key"))
    
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
    .log("prolificID", getVar("proID"))
    .log("age", getVar("IDage"))
    .log("sex", getVar("IDsex"))
    .log("L2", getVar("IDling"))
    .log("whichL2", getVar("whichL2")) 
    .log("type", "post-instr")
    .log("lifetime" , "post-instr")
    .log("tense", "post-instr")
    .log("mm", "post-instr")
    .log("match", "post-instr")
    .log("rating", "post-instr")
    .log("item" , "post-instr") 
    .log("name" , "post-instr")  
    .log("list", "post-instr")
    .log( "withsquare", PennController.GetURLParameter("withsquare") )    
    .log("bare_verb","post-instr") 
    .log( "yes_key" , getVar("yes_key"))  
    
    
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
               newTextInput("notice")
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
               newTextInput("about")
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
    .log("prolificID", getVar("proID"))  
    .log("age", getVar("IDage"))
    .log("sex", getVar("IDsex"))
    .log("L2", getVar("IDling"))
    .log("whichL2", getVar("whichL2")) 
    .log("type", "post-ques")
    .log("lifetime" , "post-ques")
    .log("tense", "post-ques")
    .log("mm", "post-ques")
    .log("match", "post-ques")
    .log("rating", "post-ques")
    .log("item" , "post-ques") 
    .log("name" , "post-ques")  
    .log("list", "post-ques")
    .log( "withsquare", PennController.GetURLParameter("withsquare"))    
    .log("bare_verb", "post-ques")
    .log("post-ques1", getVar("notice"))
    .log("post-ques2", getVar("about"))
    .log("post-ques3", getVar("easyhard"))
    .log("post-ques4", getVar("strategy")
        );

//====================================================================================================================================================================================================================
// 7. Comprehension test explanation screen //

PennController( "post-task-intro",
                newText("comp1_1", "<p>Thank you for your feedback! We have a final task for you to complete before you are presented with your Prolific validation link.</b>")
                .settings.css("font-size", "20px")
                ,        
                newText("comp1_2", "You will be presented with a list of names of cultural figures. Some of them were included in the experiment, some were not. <b>Please indicate whether you're familiar with each cultural figure</b>, regardless of whether or not the name appeared in the experiment. <p>After you have made your selections, you can retrieve your Prolific validation link by clicking 'Continue'.")
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
                            
                            
                            PennController.Template(PennController.GetTable( "validation.csv")// change this line for the appropriate experimental list
                            ,
                            variable => PennController( "final"
                            ,
                            newText("<p>Thank you for your participation!"
                            + " Here is your validation code: <b>"+variable.val_code+".</b>"
                            + "<br><p>Enter this code on the Prolific website in order to receive your payment.</p>")
                            .settings.css("font-size", "20px")
                            .settings.center()
                            .print()
                            ,
                            newButton("void")
                            .wait()
                            )
                            
                            .setOption("countsForProgressBar", false)    //overrides some default settings, such as countsForProgressBar
                            .setOption("hideProgressBar", true)
                            );
