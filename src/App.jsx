import React, { useState, useEffect } from 'react';
import { PreviewMap, Style } from 'geostyler';
import SLDParser from 'geostyler-sld-parser';
import WfsParser from 'geostyler-wfs-parser';

import './App.css';
import 'antd/dist/antd.css';


const wfsParser = new WfsParser();

const App = () => {

  const [wfsParams,setWfsParams] = useState();
  const [data,setData] = useState();
  const [style,setStyle] = useState()

  const parser = new SLDParser();

  const getSLDStyle = async () => {


    let sldStyle = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><StyledLayerDescriptor xmlns=\"http://www.opengis.net/sld\" xmlns:ogc=\"http://www.opengis.net/ogc\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" version=\"1.0.0\" xsi:schemaLocation=\"http://www.opengis.net/sld StyledLayerDescriptor.xsd\"><NamedLayer><Name>default_polygon</Name><UserStyle><Title>Default Polygon</Title><Abstract>A sample style that draws a polygon</Abstract><FeatureTypeStyle><Rule><Name>rule1</Name><Title>Gray Polygon with Black Outline</Title><Abstract>A polygon with a gray fill and a 1 pixel black outline</Abstract><PolygonSymbolizer><Fill><CssParameter name=\"fill\">#AAAAAA</CssParameter></Fill><Stroke><CssParameter name=\"stroke\">#000000</CssParameter><CssParameter name=\"stroke-width\">1</CssParameter></Stroke></PolygonSymbolizer></Rule></FeatureTypeStyle></UserStyle></NamedLayer></StyledLayerDescriptor>";


    let sldPromise = await parser.readStyle(sldStyle);

    
    setStyle(sldPromise.output);

  }

  const getLayerData = async () => {

    // layer info obtained from: https://artf.centrogeo.org.mx/api/v2/datasets/9

    let wfsParams = {
      url: "https://artf.centrogeo.org.mx/geoserver/ows",
      requestParams: {
        version: "1.1.0",
        typeName: "geonode:areas_natrales_protegidas_cdmx_2000_paot",
      }
    };
    
    let dataPromise = await wfsParser.readData(wfsParams);
    
    setWfsParams(wfsParams);
    setData(dataPromise);
  }


  useEffect(() => {
    getSLDStyle();
    getLayerData();
  },[])


  return (
      <div>
        <div className='styler-container'>
            {wfsParams && <Style
              style={style}
              data={data}
              compact={true}
              showAmountColumn={false}
              showDuplicatesColumn={false}
              ruleRendererType={"SLD"}
              sldRendererProps={{
                wmsBaseUrl: wfsParams.url,
                layer: wfsParams.requestParams.typeName
              }}
              onStyleChange={(newStyle) => {setStyle(newStyle)}}
            />}
            { style && (<PreviewMap
              style={style}
              data={data}
              dataProjection={"EPSG:32614"}
            />) }
          </div>
      </div>
  )
}

export default App;