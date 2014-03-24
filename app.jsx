/** @jsx React.DOM */



var Entity = React.createClass({
    
    getInitialState: function() {
        return {
            dragStart: null 
        };
    },

    onDragStart: function(e) {
        this.setState({
            dragStart: {x: e.pageX, y: e.pageY}
        })
        return false;
    },
    onDrag: function(e) {
        if (this.state.dragStart) {
            this.props.setPosition(this.props.x - Math.floor((this.state.dragStart.x - e.pageX)) / (this.props.gridSize),
                                   this.props.y - Math.floor((this.state.dragStart.y - e.pageY)) / (this.props.gridSize))

            this.setState({
                dragStart: {x: e.pageX, y: e.pageY}
            })
        }
        return false;
    },

    onDragEnd: function(e) {
        this.setState({
            dragStart: null,
        })
        this.props.setPosition(Math.round(this.props.x), Math.round(this.props.y))
        return false;
    },

    render: function() {
        var style = {
            width: this.props.width * this.props.gridSize - 2 + "px",
            height: this.props.height * this.props.gridSize - 2 + "px",
            backgroundColor: this.props.color,
            position: "absolute",
            top: (this.props.offsety + this.props.y + 2) * (this.props.gridSize) + 1,
            left: (this.props.offsetx + this.props.x + 2) * (this.props.gridSize) + 1
        }

        var outDivStyle = {
            width: this.state.dragStart ? window.innerWidth + "px" : "auto",
            height: this.state.dragStart ? window.innerHeight + "px" : "auto"
        }
        return (
            <div style={outDivStyle}
                 onMouseMove={this.onDrag}
                 onMouseDown={this.onDragStart}
                 onMouseUp={this.onDragEnd}>
                <div style={style}></div>
            </div>
        );
      }
});


var Entities = React.createClass({

    render: function() {

        var entities = _.map(this.props.entities, function(entity, key) {
            if (entity.y * this.props.gridSize + this.props.offsety * this.props.gridSize < this.props.windowHeight ||
                entity.x * this.props.gridSize + this.props.offsetx * this.props.gridSize < this.props.windowWidth) {
                    return (<Entity 
                                setPosition={this.props.setPosition(key)}
                                width={entity.width} 
                                height={entity.height}
                                color={entity.color}
                                offsetx={this.props.offsetx}
                                offsety={this.props.offsety}
                                gridSize={this.props.gridSize}
                                x={entity.x}
                                y={entity.y} />)
            }
        }.bind(this));
        return (
            <div>
                {entities}
            </div>
        );
      }
});


var Page = React.createClass({
    getInitialState: function() {
        return {
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            gridSize: 30,
            currentEntity: "test",
            entities: {
                test: {
                    color:"#333",
                    width: 2,
                    height: 2,
                    x: 8,
                    y: 2
                },
                test1: {
                    color:"#a00",
                    width: 1,
                    height: 1,
                    x: 1,
                    y: 1
                },
            },
            offsety: 6,
            offsetx: 5
        }
    },

    entityPosition: function(entity) {
        return function(x,y) {
            var entities = this.state.entities;
            entities[entity].x = x
            entities[entity].y = y
            this.setState({
                entities: entities
            })
        }.bind(this)
    },

    handleResize: function(e) {
        this.setState({
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight
        });
    },

    addObject: function(x,y) {
        var entities = this.state.entities;
        entities[this.state.currentEntity].x = x;
        entities[this.state.currentEntity].y = y;
        this.setState({
            entities: entities
        })
    },

    componentDidMount: function() {
        window.addEventListener('resize', this.handleResize);
    },

    componentWillUnmount: function() {
        window.removeEventListener('resize', this.handleResize);
    },

    onDragStart: function(e) {
        this.setState({
            dragStart: {x: e.pageX, y: e.pageY}
        })
    },

    onDrag: function(e) {
        if (this.state.dragStart) {
            this.setState({
                offsetx: this.state.offsetx - Math.floor((this.state.dragStart.x - e.pageX)) / (this.state.gridSize),
                offsety: this.state.offsety - Math.floor((this.state.dragStart.y - e.pageY)) / (this.state.gridSize),
                dragStart: {x: e.pageX, y: e.pageY}

            })
        }
    },

    onDragEnd: function(e) {
        this.setState({
            dragStart: null,
        })
    },

    render: function() {

        var numWidth = this.state.windowWidth / this.state.gridSize;
        var numHeight = this.state.windowHeight / this.state.gridSize;
        return (
            <div id="background" 
                 onMouseMove={this.onDrag}
                 onMouseDown={this.onDragStart}
                 onMouseUp={this.onDragEnd}
                 style={{width: this.state.windowWidth, height:this.state.windowHeight, backgroundPosition:this.state.offsetx*this.state.gridSize + "px " + this.state.offsety*this.state.gridSize  +"px"}}>
                <Entities 
                    setPosition={this.entityPosition}
                    entities={this.state.entities} 
                    windowHeight={this.state.windowHeight} 
                    windowWidth={this.state.windowWidth}
                    offsetx={this.state.offsetx}
                    offsety={this.state.offsety}
                    gridSize={this.state.gridSize} />
            </div>
        );
      }
});



React.renderComponent(
    <Page />,
    document.getElementById("root")
);
