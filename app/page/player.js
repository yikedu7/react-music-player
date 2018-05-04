import React from 'react';
let PubSub = require('pubsub-js');

import Progress from '../components/progress';
import { Link } from 'react-router';
require('./player.less');

let duration = null;

let Player = React.createClass({
    progressChangeHandler(progress) {
        $("#player").jPlayer("play", duration * progress);
    },
    volumeChangeHandler(progress) {
        $("#player").jPlayer("volume", progress);
    },
    play() {
        if (this.state.isPlay) {
            $("#player").jPlayer("pause");
        }
        else {
            $("#player").jPlayer("play");
        }
        this.setState({
            isPlay: !this.state.isPlay
        });
    },
    prev() {
        PubSub.publish('PLAY_PREV');
    },
    next() {
        PubSub.publish('PLAY_NEXT');
    },
    formatTime(time) {
        time = Math.floor(time);
        var minute = Math.floor(time / 60);
        var second = Math.floor(time % 60);
        return (minute + ':' + (second < 10 ? '0' + second : second));
    },
    getInitialState() {
        return {
            progress: 0,
            volume: 0,
            isPlay: true,
            leftTime: ""
       }
    },
    componentDidMount() {
        // 绑定时间更新事件
        $("#player").bind($.jPlayer.event.timeupdate, (e) => {
            duration = e.jPlayer.status.duration;           
            this.setState({
                progress: e.jPlayer.status.currentPercentAbsolute,
                volume: e.jPlayer.options.volume * 100,
                leftTime: this.formatTime(duration * (1 - e.jPlayer.status.currentPercentAbsolute / 100))
            });
        });
        // 绑定歌曲终止事件
        $("#player").bind($.jPlayer.event.ended, (e) => {
            this.next();
        });
    },
    componentWillUnmount() {
        $("#player").unbind($.jPlayer.event.timeupdate);
    },
	render() {
        return (
            <div className="player-page">
                <h1 className="caption"><Link to="/list">我的私人音乐坊 &gt;</Link></h1>
                <div className="mt20 row">
                	<div className="controll-wrapper">
                		<h2 className="music-title">{this.props.currentMusicItem.title}</h2>
                		<h3 className="music-artist mt10">{this.props.currentMusicItem.artist}</h3>
                		<div className="row mt20">
                			<div className="left-time -col-auto">-{this.state.leftTime}</div>
                			<div className="volume-container">
                				<i className="icon-volume rt" style={{top: 5, left: -5}}></i>
                				<div className="volume-wrapper">
					                <Progress
										progress={this.state.volume}
										onProgressChange={this.volumeChangeHandler}
										barColor='#aaa'
					                >
					                </Progress>
                				</div>
                			</div>
                		</div>
                		<div style={{height: 10, lineHeight: '10px'}}>
			                <Progress
								progress={this.state.progress} 
								onProgressChange={this.progressChangeHandler}
			                >
			                </Progress>
                		</div>
                		<div className="mt35 row">
                			<div>
	                			<i className="icon prev" onClick={this.prev}></i>
	                			<i className={`icon ml20 ${this.state.isPlay ? 'pause' : 'play'}`} onClick={this.play}></i>
	                			<i className="icon next ml20" onClick={this.next}></i>
                			</div>
                			<div className="-col-auto">
                				<i className="icon repeat-once" onClick=""></i>
                			</div>
                		</div>
                	</div>
                	<div className="-col-auto cover">
                		<img src={this.props.currentMusicItem.cover} alt={this.props.currentMusicItem.title}/>
                	</div>
                </div>
            </div>
        );
    }
});

export default Player;