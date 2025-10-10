"use client";
import {React} from 'react';
import './FlowBlock.css';
const style = {
    block:{
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        position:'relative',
        height:'100%'
    },
    comp1:{
        position:'absolute',
    }

}

const FlowBlock = (props) => {
    return(
        <div id={props.idx} className={`blockContainer`} style={props.style}>
            <div className='svgblock' style={style.block}>
                <svg
                style={style.comp1}
                width="250px"
                viewBox="0 0 210 296.99999"
                version="1.1"
                id="svg1"
                xmlns="http://www.w3.org/2000/svg">
                <defs
                    id="defs1" />
                <g
                    id="layer1">
                    <path
                    id="rect1"
                    style={{fill:`${props.fill}`,fillOpacity:0.50399,strokeWidth:1.806,strokeOpacity:0.675289}}
                    d="M 8.4108601,44.923041 85.726555,148.17411 8.4000051,251.43912 H 130.91449 l 76.95499,-102.76944 h 0.7426 l -0.37156,-0.49609 0.36019,-0.48059 h -0.71986 L 130.92534,44.923041 Z" />
                </g>
                </svg>
                <img src={props.icon} style={{width:'70px', height:'70px', position:'absolute',left:'135px', filter:'brightness(0) invert(1)'}}></img>
            </div>
            <div className='content' style={style.blockContent}>
                <h1 style={{marginLeft:'5%', padding:'10px 30px', boxSizing:'border-box', borderRadius:'50px', backgroundColor:`${props.fill}`, width:'min-content'}}>{props.heading}</h1>
                <p style={{padding:'10px 30px'}}>{props.text}</p>
            </div>
        </div>
    )
}

export default FlowBlock;