<?Infragistics.Models format="xaml" version="2"?>
<Flow xmlns="http://prototypes.infragistics.com/flows"
                                                        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml">
    <Flow.Items>
        <Step x:Uid="$2" Title="The student taps on the clock at the top of the screen, pulling up their class schedule." ContentView="/main.screen" ContentState="ccbc08b7-7e7d-8d47-6872-d92b6c7e86f4" ContentScene="2" ContentSceneHotSpotWidth="126" ContentSceneHotSpotHeight="190" X="979" Y="181" Width="430" Height="322" />
        <Step x:Uid="$1" Title="Student logs into the Student Utility. This is the main screen, which shows important information in an easy-to-view dashboard." ContentView="/main.screen" ContentState="f0f0dd5e-f321-3487-2442-37690232ac2d" ContentScene="4" ContentSceneHotSpotWidth="132" ContentSceneHotSpotHeight="198" X="447" Y="181" Width="430" Height="322" />
        <Connector Source="{Reference $1}" Target="{Reference $2}" Bidirectional="True" />
        <Step x:Uid="$4" Title="Student also makes sure he is conncted to a cellular data or WiFi network." ContentView="/login.screen" ContentState="15434e87-3fdc-ccb2-d834-f30822321c29" ContentScene="4" ContentSceneHotSpotWidth="132" ContentSceneHotSpotHeight="198" X="447" Y="-247" Width="430" Height="322" />
        <Step x:Uid="$5" Title="For some reason the student reades the about information." ContentView="/login.screen" ContentState="b7501ab9-6c55-5ed8-afaf-964e37f26b63" ContentScene="4" ContentSceneHotSpotWidth="132" ContentSceneHotSpotHeight="198" X="447" Y="631" Width="430" Height="322" />
        <Step x:Uid="$3" Title="Student opens the Student Utility on their smartphone. They are presented with the login screen." ContentView="/login.screen" ContentState="b4da3990-21e0-b75a-3cb6-c9329487fa94" ContentScene="238" ContentSceneHotSpotWidth="126" ContentSceneHotSpotHeight="190" X="-94" Y="181" Width="430" Height="322" />
        <Connector Source="{Reference $3}" Target="{Reference $4}" Bidirectional="True" />
        <Connector Source="{Reference $3}" Target="{Reference $5}" Bidirectional="True" />
    </Flow.Items>
</Flow>
