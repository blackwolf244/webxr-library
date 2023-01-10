<template>
  <div class="box">
    <div class="content styled-scrollbars" >
      <h2>Exploring the Development of WebXR: Challenges, Applications, and Future Directions</h2>
      <p>WebXR, or Extended Reality on the Web, has seen rapid growth and development in recent years, with significant potential to impact industries and applications. In this thesis, we explore the current state of WebXR technology, examining its key challenges and opportunities, while investigating its potential future developments and implications for society and industry.<br/><br/>Through a comprehensive review of literature, analysis of existing research, and the development of prototypes, this thesis aims to provide an in-depth evaluation of WebXR, its use, and its role in our future.</p>

      <p><b>You can read my full publication over here:</b> <br/><a href="">insertlink.wow.com</a> </p>
    </div>
    <div class="info styled-scrollbars">
      <h2>WebXR Literature</h2>
      <p>Extended Reality in the Web <br/>
        <small>Extended Reality (XR) is a catch-all term to refer to Augmented Reality (AR) and Virtual Reality (VR).</small> <br/>
      </p>
      <p>Source: <br/> <a href="https://en.wikipedia.org/wiki/Extended_Reality" target="_blank">https://en.wikipedia.org/wiki/Extended_Reality</a></p>
      
    </div>
  </div>
</template>

<style scoped>
  p{
    font-size:large;
    text-transform: uppercase;
    color: rgb(66, 66, 66);
  }

  .box{
    height: fit-content;
    display: flexbox;
    width: calc(100vw - 8rem);
  }
  .content{
    width: 60%;
    float: left;
    max-height: calc(100vh - 100px - 17rem);;
    overflow-y: scroll;
    padding-right: 1rem;
    padding-top: 10px;
    border-right: 1px solid black;
  }

  .info {
    float: right;
    max-height: calc(100vh - 100px - 17rem);
    padding-top: 10px;
    padding-left: 1rem;
    overflow-y: scroll;
    width: calc(40% - 3rem);
    }
  p a{
    font-size: small;
    overflow-wrap: break-word;
    color: black;
    text-decoration: underline;
  }

  p a:hover{
  background-color: black;
  color: white;
  font-weight: bold;
  padding: 5px;
  }

  .info p {
    margin-bottom: 1.5rem;
  }

  .styled-scrollbars::-webkit-scrollbar-track
  {
    background-color: #f8f8f8;
  }

  .styled-scrollbars::-webkit-scrollbar
  {
    width: 5px;
    height: 5px;
    background-color: #f8f8f8;
  }

  .styled-scrollbars::-webkit-scrollbar-thumb
  {
    background-color: black;
  }

  @media screen and (max-width: 900px) {
    .box{
      width: calc(100vw - 4rem);
    }
    .content{
      padding: 0;
      width: 100%;
      max-height: fit-content;

    }
    .info {
      padding: 0;
      border-right: 1px solid black;
      margin-bottom: 5rem;
      margin-top: 20px;
      width: 100%;
      float: none;
      max-height: fit-content;
    }
    p {
        font-size: 0.9rem;
      }
  }
</style>