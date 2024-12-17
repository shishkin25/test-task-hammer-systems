import { useState } from 'react';
import { Button } from 'antd';
import { Input } from 'antd';
import styles from './Planner.module.scss';

import img1 from './img/1.jpg';
import img2 from './img/2.jpg';
import img3 from './img/3.jpg';
import img4 from './img/4.jpg';
import img5 from './img/5.jpg';
import img6 from './img/6.jpg';
import img7 from './img/7.jpg';

const images = [
  { id: 1, imgSrc: img1, name: 'Элемент 1' },
  { id: 2, imgSrc: img2, name: 'Элемент 2' },
  { id: 3, imgSrc: img3, name: 'Элемент 3' },
  { id: 4, imgSrc: img4, name: 'Элемент 4' },
  { id: 5, imgSrc: img5, name: 'Элемент 5' },
  { id: 6, imgSrc: img6, name: 'Элемент 6' },
  { id: 7, imgSrc: img7, name: 'Элемент 7' },
];

const Planner = () => {
  const [gridArray, setGridArray] = useState(new Array(20).fill(undefined));

  const handleSave = () => {
    const gridData = gridArray
      .map((item, index) => {
        return item ? { id: item.id, index } : null;
      })
      .filter(Boolean);

    const blob = new Blob([JSON.stringify(gridData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'layout.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        const updatedGrid = new Array(20).fill(undefined);
        data.forEach((item) => {
          updatedGrid[item.index] = images.find((img) => img.id === item.id);
        });
        setGridArray(updatedGrid);
      } catch (error) {
        alert('Ошибка при загрузке файла!');
      }
    };
    reader.readAsText(file);
  };

  const handleOnDrag = (e, elementObj) => {
    e.dataTransfer.setData('element', JSON.stringify(elementObj));
  };

  const handleOnDrop = (e, index) => {
    if (e.dataTransfer.getData('element')) {
      const elementObj = JSON.parse(e.dataTransfer.getData('element'));
      setGridArray(
        gridArray.map((item, i) => {
          if (index === i) {
            return { ...elementObj };
          }

          return item;
        })
      );
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <div className={styles.elementsWrapper}>
          {images.map((element) => (
            <div
              className={styles.element}
              key={element.id}
              draggable
              onDragStart={(e) => handleOnDrag(e, element)}
            >
              <img
                src={element.imgSrc}
                alt={element.name}
                className={styles.img}
              />
            </div>
          ))}
        </div>

        <div className={styles.wrapper}>
          <Button type="primary" onClick={handleSave}>
            Сохранить расстановку
          </Button>

          <Input type="file" onChange={handleFileUpload} />
        </div>
      </div>
      <div className={styles.rightPanel}>
        <div className={styles.grid}>
          {gridArray.map((item, index) => (
            <div
              className={styles.gridItem}
              key={index}
              onDrop={(e) => handleOnDrop(e, index)}
              onDragOver={handleDragOver}
            >
              {!item ? (
                index + 1
              ) : (
                <img src={item.imgSrc} alt={item.name} className={styles.img} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Planner;
