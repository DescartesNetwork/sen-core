import React, { useState } from 'react'

import { Button, Col, Input, Row, Select } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

const SearchAndFilter = () => {
  const [search, setSearch] = useState('')

  return (
    <Row gutter={[8, 8]}>
      <Col flex="auto">
        <Input
          placeholder="Search"
          value={''}
          prefix={
            search ? (
              <Button
                type="text"
                style={{
                  width: 'auto',
                  height: 'auto',
                  background: 'transparent',
                  marginLeft: -7,
                }}
                onClick={() => {}}
                icon={<IonIcon name="close-outline" />}
              />
            ) : (
              <IonIcon
                style={{ fontSize: 24, marginLeft: -5 }}
                name="search-outline"
              />
            )
          }
          onChange={(e) => {
            setSearch(e.target.value)
          }}
          style={{ borderRadius: 8, height: 40 }}
        />
      </Col>
      <Col>
        <Select
          value={''}
          onChange={(value: any) => {}}
          style={{ width: 109, borderRadius: 8, height: 40 }}
        ></Select>
      </Col>
    </Row>
  )
}

export default SearchAndFilter
