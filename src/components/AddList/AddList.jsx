import React, { useState, useEffect } from 'react';
import axios from 'axios'

import { List, Badge } from '../index'

import closeSvg from '../../assets/img/close.svg'

import './AddList.scss';

const AddList = ({ colors, onAdd }) => {
  const [visiblePopup, setVisiblePopup] = useState(false);
  const [selectedColor, setSelectedColor] = useState(3);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (Array.isArray(colors)) {
      setSelectedColor(colors[0].id)
    }
  }, [colors])

  const onClose = () => {
    setVisiblePopup(false);
    setInputValue('');
    setSelectedColor(colors[0].id);
  }

  const addList = () => {
    if (inputValue.trim() !== '') {
      setIsLoading(true)
      axios
        .post('http://localhost:3001/lists', {
          name: inputValue,
          colorId: selectedColor
        })
        .then(({ data }) => {
          const color = colors.filter(color => color.id === selectedColor)[0];
          const listObj = { ...data, color, tasks: [] }
          onAdd(listObj)
          onClose()
        })
        .catch(() => {
          alert('Ошибка при добавлении списка!')
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }


  return (
    <div className="add-list">
      <List items={[
        {
          className: 'list__add-button',
          icon: (
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 1V15" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M1 8H15" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ),
          name: 'Добавить список',
        }
      ]} onClick={() => setVisiblePopup(!visiblePopup)}

      />
      {visiblePopup &&
        (<div className="add-list__popup">
          <img
            onClick={onClose}
            src={closeSvg}
            alt="" className="add-list__popup-close-btn"
          />

          <input
            value={inputValue}
            type="text"
            className="field"
            placeholder="Название списка"
            onChange={(event) => setInputValue(event.target.value)}
          />

          <div className="add-list__popup-colors">
            {colors.map(color => (
              <Badge
                onClick={() => setSelectedColor(color.id)}
                key={color.id}
                color={color.name}
                className={selectedColor === color.id && 'active'}
              />))}
          </div>
          <button className="button" onClick={addList}>
            {isLoading ? 'Добавление...' : 'Добавить'}
          </button>
        </div>)}
    </div>
  )
}

export default AddList;