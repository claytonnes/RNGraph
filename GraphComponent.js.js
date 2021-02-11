import React, { useState } from 'react';
import { Text } from 'react-native';
import { StyleSheet, View} from 'react-native';
import Svg, {
    Line,
    Circle
} from 'react-native-svg';


let minY;
let maxY;

//Generates points to draw lines from
function generateGraphPoints(data, xPer, yRatio, graphHeight){
    const yZeroPoint = graphHeight+(minY*yRatio);
    return data.map((value, index) => {
        return {x: xPer * index, y: (yZeroPoint - (value * yRatio))}       
    })
}

//Generates and returns a list of JSX Lines 
function generateLines(points){
    let prevX = 0;
    let prevY = points[0].y;
    let id = 0;
    const lines = points.map((value) => {
        let line = <Line key={id} x1={prevX} y1={prevY} x2={value.x} y2={value.y} stroke="white" strokeWidth="2" />
        id++;
        prevX = value.x;
        prevY = value.y;
        return line;
    })
    return lines;
}

//Gets the value of the Y-axis for given x
function getDataPointForX(points, xVal, xPerPoint){
    let index = Math.round(xVal/xPerPoint);
    if(index > points.length-1){
        return points[points.length-1];
    }
    else if(index<0){
        return points[0];
    }
    else{
        return points[index];
    }
}


export default function Graph(props) {
    //Hooks for interaction with graph
    const [isTouch, setIsTouch] = useState(false);
    const [currentDataPoint, setCurrentDataPoint] = useState({x: 0, y: 0});
    
    minY = Math.min(...props.data);
    maxY = Math.max(...props.data);

    const xPerPoint = props.width / props.data.length;
    const yRatio = props.height / (maxY-minY);

    let valueBox;
    let pointDot;

    //Renders a valueBox and pointDot if the user is pressing on the screen
    if(isTouch){
        valueBox = 
        <View style={styles.value}>
            <Text>{(maxY - (currentDataPoint.y / yRatio)).toFixed(2)}</Text>
        </View>

        pointDot = 
        <Circle cx={currentDataPoint.x} cy={currentDataPoint.y} r="5" fill="#f6c90e"/>

    }

    //Generating points for lines
    const points = generateGraphPoints(props.data, xPerPoint, yRatio, props.height);

    //Generating list of jsx-lines
    const lines = generateLines(points);

    return (
        <View 
        style={[styles.container, {height: props.height, width: props.width}]}
        onTouchStart={(e) => {
            setCurrentDataPoint(getDataPointForX(points, e.nativeEvent.locationX, xPerPoint));
            setIsTouch(true);
        }}
        onTouchEnd={() => setIsTouch(false)}
        onTouchMove={(e) =>{
            setCurrentDataPoint(getDataPointForX(points, e.nativeEvent.locationX, xPerPoint));      
        }}
        >
            {valueBox}
            <Svg height={props.height} width={props.width} style={styles.graph}>             
                {lines}
                {pointDot}
            </Svg>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#3a4750",
    },
    graph: {
        position: "absolute"
    },
    valueBox: {
        position: "absolute"
    }
})