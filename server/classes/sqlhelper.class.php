<?php
/**
 * SQL-String helper object
 * generates INSERT string to be used to insert multiple rows at once
 */
class SQLHelper {

	/**
	 * table name
	 * @var String
	 */
	public $table;

	/**
	 * table fields to save
	 * @var array
	 */
	public $fields = array();

	/**
	 * stored values
	 * @var array
	 */
	public $values = array();

	/**
	 * value to set into string when value object does not have field set
	 * @var string
	 */
	public $nullValue = 'NULL';

	/**
	 * wrap not numeric expressions like this
	 * @var string
	 */
	public $stringQuote = '\'';


	/**
	 * constructor
	 * @param String $table  table name
	 * @param Array $fields fields to save
	 */
	public function __construct($table, $fields){
		$this->table = $table;
		$this->fields = $fields;
	}

	public function addRow($row){
		$this->values[] = $row;
	}

	public function add($row){
		$this->values[] = $row;
	}

	/**
	 * generate sql -clause
	 * @return String constructed sql query string
	 */
	public function sql(){
		$rows = array();
		foreach ($this->values as $value) {
			$row = array();

			foreach ($this->fields as $field) {

				if (is_array($value) && isset($value[$field])){
					$rowValue = $value[$field];
				} else if (is_object($value) && isset($value->$field)){
					$rowValue = $value->$field;
				} else {
					$rowValue = $this->nullValue;
				}

				if (!is_numeric($rowValue) && $rowValue != $this->nullValue){
					$rowValue = $this->stringQuote.$rowValue.$this->stringQuote;
				}

				$row[] = $rowValue;
			}

			$rows[] = '('.implode(',',$row).')';
		}

		$rows = implode(',',$rows);
		return 'INSERT INTO '.$this->table.' ('.implode(',',$this->fields).') VALUES '.$rows.';';
	}


	/**
	 * build and execute the query
	 * @return [int] 1 if succesfull, 0 if failed
	 */
	public function save(){
		return ORM::raw_execute( $this->sql() );
	}

}