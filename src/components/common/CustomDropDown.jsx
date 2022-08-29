import React from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { coreToKNode, disabledEngineCore } from '../../utils/engine-list-utils';

class CustomDropDown extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showItems: false,
    };

    this.wrapperRef = React.createRef();
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  dropDown = () => {
    this.setState((prevState) => ({
      showItems: !prevState.showItems,
    }));
  };

  selectItem = (e, item, engineName) => {
    const { handelCoreChange } = this.props;
    const coreIndex = parseInt(e.currentTarget.dataset.indexNumber, 10);
    this.setState({
      showItems: false,
    });
    handelCoreChange(coreIndex, engineName);
  };

  selectOptionItem = (optioName, engineName, type) => {
    const { handleEngineOptionChnage, option } = this.props;
    this.setState({
      showItems: false,
    });
    handleEngineOptionChnage({ value: optioName }, option, engineName, type);
  };

  handleClickOutside = (event) => {
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
      this.setState({
        showItems: false,
      });
    }
  };

  render() {
    const {
      coreIndex,
      items,
      engineName,
      userFullInfo,
      type,
      engineNameStyleClassName,
    } = this.props;

    return (
      <div className="select-box--box" ref={this.wrapperRef}>
        <div className="select-box--container">
          <div
            className={`select-box--selected-item ${engineNameStyleClassName}`}
            onClick={this.dropDown}
          >
            {type === 'cores'
              ? coreToKNode(
                  null,
                  items[coreIndex[engineName]].cores,
                  engineName
                ).caption
              : items[0]}
          </div>
          <div className="select-box--arrow" onClick={this.dropDown}>
            {this.state.showItems ? (
              <IoIosArrowUp className="select-box--arrow-down" />
            ) : (
              <IoIosArrowDown className="select-box--arrow-up" />
            )}
          </div>

          <div
            style={{
              display: this.state.showItems ? 'block' : 'none',
              zIndex: 1000,
              position: 'absolute',
              marginTop: '10px',
              backgroundColor: '#fff',
            }}
            className={`select-box--items ${engineNameStyleClassName}`}
          >
            {type === 'cores'
              ? items.map((item, index) => (
                  <div
                    key={index}
                    onClick={(e) => this.selectItem(e, item, engineName)}
                    className={
                      disabledEngineCore(userFullInfo, item.cores)
                        ? ''
                        : 'disabled-item'
                    }
                    data-index-number={index}
                    name={engineName}
                  >
                    {coreToKNode(null, item.cores, engineName).caption}
                  </div>
                ))
              : items.map((item, index) => {
                  return (
                    <div
                      key={index}
                      onClick={(e) =>
                        this.selectOptionItem(item, engineName, type)
                      }
                      data-index-number={index}
                      name={engineName}
                    >
                      {item}
                    </div>
                  );
                })}
          </div>
        </div>
      </div>
    );
  }
}

export default CustomDropDown;
