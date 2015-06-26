<?php

class Util {

	/**
	 * pluck keys from object or an array
	 * @param  [array, object] $from
	 * @param  [string] $key
	 * @return [array]      array of $key values
	 */
	public static function pluck($key, $from){
		$result = array();

		foreach ($from as $row) {
			if (is_object($row)){
				$result[] = $row->$key;
			} else {
				$result[] = $row[$key];
			}
		}

		return $result;
	}



	public static function difference($a, $b){
		if (is_array($a) && is_array($b)){
			return array_diff($a, $b);
		} else if (is_object($a) && is_object($b)){
			$result = (object) array();

			foreach ($a as $key => $value) {
				if (!isset($b)){
					$result->$key = $value;
				}
			}
		}
	}



	/**
	 * group an object or an array by key
	 * @param  [string] $sortkey
	 * @param  [array, object] $input
	 * @return [array]         grouped array
	 */

	public static function group($sortkey, $input){

			$output = array();
  		foreach ($input as $key=>$val) $output[$val[$sortkey]][]=$val;

  	return $output;
	}

	public static function startOfDAy($time){
		return strtotime("midnight", $time);
	}

	public static function endOfDay($time){
		return strtotime("tomorrow", $time) - 1;
	}


	public static function chunk($array, $size){
		return array_chunk($array, $size);
	}
}